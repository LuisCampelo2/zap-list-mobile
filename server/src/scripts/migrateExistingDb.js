import { sequelize } from '../config/database.js';
import { logger } from '../utils/logger.js';

/**
 * Migração para o banco EXISTENTE do Zap-List original (11 usuários, 213
 * produtos reais) — não um banco vazio. Cada statement é estritamente
 * aditivo (ADD COLUMN IF NOT EXISTS / CREATE TABLE IF NOT EXISTS): nunca
 * altera tipo/nome de coluna existente, nunca faz DROP, nunca toca uma linha
 * já gravada. Por isso usamos SQL explícito aqui em vez de
 * `sequelize.sync({ alter: true })` — o diffing automático do Sequelize
 * poderia tentar "corrigir" colunas que não devem ser tocadas.
 */
const statements = [
  // Novas colunas em `users`, para lockout de força bruta, expiração do
  // token de ativação e o novo fluxo de reset de senha por código.
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS activation_token_expires_at TIMESTAMPTZ`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_code_hash VARCHAR(255)`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_code_expires_at TIMESTAMPTZ`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_attempts SMALLINT NOT NULL DEFAULT 0`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts SMALLINT NOT NULL DEFAULT 0`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ`,

  // Tabela nova: sessões de refresh token (rotação + detecção de replay).
  `CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    family UUID NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    replaced_by_token_hash VARCHAR(255),
    created_by_ip VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  // Tabela nova: favoritos (recurso que não existia no app original).
  `CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, product_id)
  )`,
];

try {
  await sequelize.authenticate();

  for (const sql of statements) {
    await sequelize.query(sql);
    logger.info(`OK: ${sql.split('\n')[0].slice(0, 70)}...`);
  }

  logger.info('Migração aditiva concluída — nenhuma coluna/linha existente foi alterada.');
  process.exit(0);
} catch (error) {
  logger.error('Falha na migração', error);
  process.exit(1);
}
