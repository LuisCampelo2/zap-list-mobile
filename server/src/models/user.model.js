import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

/**
 * Este model mapeia a tabela `users` JÁ EXISTENTE do banco original do
 * Zap-List (id inteiro, colunas `password`/`activationToken`/
 * `resetPasswordToken`) — não um schema novo. Os 11 usuários reais que já
 * existiam lá continuam funcionando: senha, ativação e "conta ativa"
 * (`activationToken IS NULL`) preservam exatamente a semântica original.
 *
 * As colunas abaixo marcadas "novas" foram adicionadas via migração aditiva
 * (`scripts/migrateExistingDb.js`, só ADD COLUMN IF NOT EXISTS) para
 * suportar os recursos de segurança novos (lockout, expiração de token de
 * ativação, código de reset com tentativas) sem tocar nas colunas/linhas
 * existentes. `resetPasswordToken` (coluna antiga) foi deixada intocada no
 * banco mas não é mais usada pelo código — substituída pelo par
 * password_reset_code_hash/expires_at, mais seguro (ver README).
 */
export const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'last_name',
    },
    // Armazenado sempre em minúsculas (normalizado em user.service.js) para que
    // a unicidade e a busca por email sejam case-insensitive sem depender da
    // extensão citext do Postgres.
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    // Coluna existente chama-se "password", mas já guardava um hash bcrypt
    // (não a senha em texto puro) no projeto original — só o nome é legado.
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password',
    },
    // Coluna existente, camelCase entre aspas no Postgres (não é snake_case).
    // NULL = conta ativa (mesma convenção do projeto original).
    activationToken: {
      type: DataTypes.STRING,
      field: 'activationToken',
    },
    // -- novas, adicionadas via migração aditiva --
    activationTokenExpiresAt: {
      type: DataTypes.DATE,
      field: 'activation_token_expires_at',
    },
    passwordResetCodeHash: {
      type: DataTypes.STRING,
      field: 'password_reset_code_hash',
    },
    passwordResetCodeExpiresAt: {
      type: DataTypes.DATE,
      field: 'password_reset_code_expires_at',
    },
    passwordResetAttempts: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
      field: 'password_reset_attempts',
    },
    failedLoginAttempts: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
      field: 'failed_login_attempts',
    },
    lockedUntil: {
      type: DataTypes.DATE,
      field: 'locked_until',
    },
  },
  {
    tableName: 'users',
    timestamps: false,
  }
);
