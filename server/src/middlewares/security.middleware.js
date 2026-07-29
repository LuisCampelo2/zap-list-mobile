import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

/**
 * Apps mobile nativos (via axios/fetch fora de um WebView) não enviam header
 * Origin, então essa allowlist barra principalmente chamadas feitas a partir
 * de navegador/emulador com origem não autorizada — defesa em profundidade,
 * não a proteção principal (essa é o access token + rate limiting).
 */
export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin || env.corsAllowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new AppError('Origem não permitida', 403));
  },
});

export const helmetMiddleware = helmet();

/** Limite geral, generoso, para toda a API — protege contra abuso/DoS básico. */
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Um limitador por fluxo (não um único compartilhado): um usuário que errou
 * a senha várias vezes não pode ficar travado tentando recuperar a senha em
 * seguida — os dois fluxos competiriam pela mesma cota se dividissem um
 * único limiter, penalizando o caso de uso legítimo mais comum de "esqueci
 * minha senha depois de errar o login".
 */
const createAuthRateLimit = () =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Muitas tentativas. Tente novamente mais tarde.' },
  });

export const loginRateLimit = createAuthRateLimit();
export const registerRateLimit = createAuthRateLimit();
export const activateRateLimit = createAuthRateLimit();
export const passwordResetRateLimit = createAuthRateLimit();
