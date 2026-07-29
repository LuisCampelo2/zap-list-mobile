import { tokenService } from '../services/token.service.js';
import { AppError } from '../utils/AppError.js';

/** Protege rotas exigindo um access token JWT válido no header Authorization: Bearer <token>. */
export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return next(new AppError('Token não fornecido', 401));
  }

  try {
    const payload = tokenService.verifyAccessToken(token);
    req.auth = { userId: payload.sub, email: payload.email };
    next();
  } catch {
    next(new AppError('Token inválido ou expirado', 401));
  }
};

/**
 * Para rotas públicas que enriquecem a resposta quando o usuário está
 * logado (ex: marcar `isFavorite` no catálogo). Nunca rejeita a requisição —
 * um token ausente ou inválido apenas resulta em `req.auth` indefinido.
 */
export const attachAuthIfPresent = (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();

  try {
    const payload = tokenService.verifyAccessToken(token);
    req.auth = { userId: payload.sub, email: payload.email };
  } catch {
    // Token inválido/expirado numa rota pública: segue como anônimo.
  }
  next();
};
