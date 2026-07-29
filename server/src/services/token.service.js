import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { env } from '../config/env.js';
import { RefreshToken } from '../models/refreshToken.model.js';
import { AppError } from '../utils/AppError.js';

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

const hash = (value) =>
  crypto.createHmac('sha256', env.jwt.refreshPepper).update(value).digest('hex');

const randomOpaqueToken = () => crypto.randomBytes(48).toString('base64url');

/**
 * Access token: JWT curto (15min) verificado sem consulta ao banco, para
 * manter as rotas autenticadas rápidas e stateless.
 * Refresh token: string opaca de alta entropia; só o hash HMAC é persistido,
 * o que permite revogação/rotação (algo que um JWT auto-contido não permite
 * sem uma blocklist) — ver ROTAÇÃO e DETECÇÃO DE REPLAY abaixo.
 */
export const tokenService = {
  signAccessToken(user) {
    return jwt.sign({ sub: user.id, email: user.email }, env.jwt.accessSecret, {
      expiresIn: ACCESS_TOKEN_TTL,
    });
  },

  verifyAccessToken(token) {
    return jwt.verify(token, env.jwt.accessSecret);
  },

  /** Cria a primeira sessão de refresh (login) — inicia uma nova família de rotação. */
  async issueRefreshSession(userId, { ip } = {}) {
    const family = crypto.randomUUID();
    const raw = randomOpaqueToken();
    await RefreshToken.create({
      userId,
      family,
      tokenHash: hash(raw),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      createdByIp: ip,
    });
    return raw;
  },

  /**
   * Troca um refresh token válido por um novo (rotação), invalidando o antigo.
   * Se o token apresentado já tiver sido revogado anteriormente, isso indica
   * reuso (roubo/replay) — toda a família é revogada imediatamente, forçando
   * novo login em todos os dispositivos daquela sessão.
   */
  async rotateRefreshToken(rawToken, { ip } = {}) {
    if (!rawToken) throw new AppError('Sessão inválida', 401);

    const tokenHash = hash(rawToken);
    const current = await RefreshToken.findOne({ where: { tokenHash } });

    if (!current) throw new AppError('Sessão inválida', 401);

    if (current.revokedAt) {
      await RefreshToken.update(
        { revokedAt: new Date() },
        { where: { family: current.family, revokedAt: { [Op.is]: null } } }
      );
      throw new AppError('Sessão comprometida detectada. Faça login novamente.', 401);
    }

    if (current.expiresAt < new Date()) {
      throw new AppError('Sessão expirada. Faça login novamente.', 401);
    }

    const raw = randomOpaqueToken();
    const newHash = hash(raw);

    await RefreshToken.create({
      userId: current.userId,
      family: current.family,
      tokenHash: newHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      createdByIp: ip,
    });

    current.revokedAt = new Date();
    current.replacedByTokenHash = newHash;
    await current.save();

    return { userId: current.userId, raw };
  },

  async revokeRefreshToken(rawToken) {
    if (!rawToken) return;
    await RefreshToken.update(
      { revokedAt: new Date() },
      { where: { tokenHash: hash(rawToken), revokedAt: { [Op.is]: null } } }
    );
  },

  /** Usado em reset de senha e em suspeita de comprometimento: derruba todas as sessões do usuário. */
  async revokeAllForUser(userId) {
    await RefreshToken.update(
      { revokedAt: new Date() },
      { where: { userId, revokedAt: { [Op.is]: null } } }
    );
  },

  hashOpaqueToken: hash,
  randomOpaqueToken,
};
