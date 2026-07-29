import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { userService } from '../services/user.service.js';
import { passwordService } from '../services/password.service.js';
import { tokenService } from '../services/token.service.js';
import { emailService } from '../services/email.service.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../utils/logger.js';

const ACTIVATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const RESET_CODE_TTL_MS = 10 * 60 * 1000; // 10min
const RESET_TOKEN_TTL = '10m';
const MAX_RESET_ATTEMPTS = 5;
const MAX_FAILED_LOGINS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15min

// Hash bcrypt pré-computado de uma senha aleatória, usado quando o email não
// existe — mantém o tempo de resposta do login equivalente ao de um email
// válido com senha errada, para não vazar existência de conta por timing.
const DUMMY_HASH = '$2b$12$K8f2t3Qm3z0m0mYQ8Hn8ZuQqYVQqYVQqYVQqYVQqYVQqYVQqYVQqu';

const generateSixDigitCode = () => crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');

const register = asyncHandler(async (req, res) => {
  const { name, lastName, email, password } = req.body;

  const existing = await userService.findByEmail(email);
  if (existing) {
    throw new AppError('Já existe uma conta com este email', 409);
  }

  const passwordHash = await passwordService.hash(password);
  const activationToken = tokenService.randomOpaqueToken();

  const user = await User.create({
    name,
    lastName,
    email,
    passwordHash,
    activationToken: tokenService.hashOpaqueToken(activationToken),
    activationTokenExpiresAt: new Date(Date.now() + ACTIVATION_TOKEN_TTL_MS),
  });

  emailService
    .sendActivationEmail(user.email, activationToken)
    .catch((err) => logger.error('Falha ao enviar email de ativação', err));

  res.status(201).json({
    message: 'Conta criada. Verifique seu email para ativá-la.',
    user: userService.toPublicUser(user),
  });
});

const activate = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const tokenHash = tokenService.hashOpaqueToken(token);

  const user = await User.findOne({ where: { activationToken: tokenHash } });

  if (!user || !user.activationTokenExpiresAt || user.activationTokenExpiresAt < new Date()) {
    throw new AppError('Token de ativação inválido ou expirado', 400);
  }

  user.activationToken = null;
  user.activationTokenExpiresAt = null;
  await user.save();

  res.json({ message: 'Conta ativada com sucesso' });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.findByEmail(email);

  // Conta bloqueada por excesso de tentativas: mesma mensagem genérica do
  // caso de senha errada, para não revelar o estado da conta a quem não
  // sabe a senha.
  if (user?.lockedUntil && user.lockedUntil > new Date()) {
    throw new AppError('Email ou senha inválidos', 401);
  }

  const passwordIsValid = await passwordService.compare(password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !passwordIsValid) {
    if (user) {
      const attempts = user.failedLoginAttempts + 1;
      user.failedLoginAttempts = attempts;
      if (attempts >= MAX_FAILED_LOGINS) {
        user.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
      }
      await user.save();
    }
    throw new AppError('Email ou senha inválidos', 401);
  }

  // Senha correta a partir daqui — seguro revelar estado de ativação, pois
  // quem não conhece a senha nunca chega neste ponto.
  if (user.activationToken !== null) {
    throw new AppError('Conta ainda não ativada. Verifique seu email.', 403);
  }

  user.failedLoginAttempts = 0;
  user.lockedUntil = null;
  await user.save();

  const publicUser = userService.toPublicUser(user);
  const accessToken = tokenService.signAccessToken(publicUser);
  const refreshToken = await tokenService.issueRefreshSession(user.id, { ip: req.ip });

  res.json({
    message: 'Login realizado com sucesso',
    accessToken,
    refreshToken,
    user: publicUser,
  });
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const { userId, raw } = await tokenService.rotateRefreshToken(refreshToken, { ip: req.ip });
  const user = await userService.findById(userId);

  if (!user || user.activationToken !== null) {
    throw new AppError('Sessão inválida', 401);
  }

  const publicUser = userService.toPublicUser(user);
  const accessToken = tokenService.signAccessToken(publicUser);

  res.json({ accessToken, refreshToken: raw, user: publicUser });
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  await tokenService.revokeRefreshToken(refreshToken);
  res.status(204).send();
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await userService.findByEmail(email);

  if (user) {
    const code = generateSixDigitCode();
    user.passwordResetCodeHash = tokenService.hashOpaqueToken(code);
    user.passwordResetCodeExpiresAt = new Date(Date.now() + RESET_CODE_TTL_MS);
    user.passwordResetAttempts = 0;
    await user.save();

    emailService
      .sendPasswordResetCode(user.email, code)
      .catch((err) => logger.error('Falha ao enviar código de recuperação', err));
  }

  // Resposta idêntica exista ou não a conta — impede enumeração de emails
  // cadastrados através deste endpoint.
  res.json({ message: 'Se este email estiver cadastrado, você receberá um código em instantes.' });
});

const verifyResetCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  const user = await userService.findByEmail(email);

  const invalid = () => new AppError('Código inválido ou expirado', 400);

  if (
    !user ||
    !user.passwordResetCodeHash ||
    !user.passwordResetCodeExpiresAt ||
    user.passwordResetCodeExpiresAt < new Date()
  ) {
    throw invalid();
  }

  if (user.passwordResetAttempts >= MAX_RESET_ATTEMPTS) {
    throw new AppError('Muitas tentativas. Solicite um novo código.', 429);
  }

  const providedHash = Buffer.from(tokenService.hashOpaqueToken(code));
  const storedHash = Buffer.from(user.passwordResetCodeHash);
  const isValidCode =
    providedHash.length === storedHash.length && crypto.timingSafeEqual(providedHash, storedHash);

  if (!isValidCode) {
    user.passwordResetAttempts += 1;
    await user.save();
    throw invalid();
  }

  // Código correto: consome-o (não pode ser reusado) e troca por um token de
  // curta duração que autoriza apenas a etapa final de troca de senha.
  user.passwordResetCodeHash = null;
  user.passwordResetCodeExpiresAt = null;
  user.passwordResetAttempts = 0;
  await user.save();

  const resetToken = jwt.sign({ sub: user.id, purpose: 'password_reset' }, env.jwt.accessSecret, {
    expiresIn: RESET_TOKEN_TTL,
  });

  res.json({ resetToken });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, password } = req.body;

  let payload;
  try {
    payload = jwt.verify(resetToken, env.jwt.accessSecret);
  } catch {
    throw new AppError('Sessão de redefinição inválida ou expirada', 401);
  }

  if (payload.purpose !== 'password_reset') {
    throw new AppError('Sessão de redefinição inválida', 401);
  }

  const user = await userService.findById(payload.sub);
  if (!user) {
    throw new AppError('Sessão de redefinição inválida', 401);
  }

  user.passwordHash = await passwordService.hash(password);
  user.failedLoginAttempts = 0;
  user.lockedUntil = null;
  await user.save();

  // Troca de senha revoga todas as sessões ativas — se o comprometimento
  // veio de um token/refresh roubado, ele deixa de funcionar imediatamente.
  await tokenService.revokeAllForUser(user.id);

  res.json({ message: 'Senha alterada com sucesso. Faça login novamente.' });
});

export const authController = {
  register,
  activate,
  login,
  refresh,
  logout,
  forgotPassword,
  verifyResetCode,
  resetPassword,
};
