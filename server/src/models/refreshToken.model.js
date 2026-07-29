import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { User } from './user.model.js';

/**
 * Refresh tokens são opacos (crypto.randomBytes) e só o HASH é persistido —
 * o valor em texto puro nunca toca o banco, então um dump/leak da tabela não
 * permite personificar sessões. `family` agrupa toda a cadeia de rotação de
 * um login: se um token já usado (revoked) for reapresentado, é sinal de
 * roubo/replay e a família inteira é revogada (logout forçado em todos os
 * dispositivos daquela sessão).
 */
export const RefreshToken = sequelize.define(
  'RefreshToken',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // INTEGER porque referencia users.id, que é serial/autoincrement no
    // banco existente (não UUID) — esta tabela em si é nova, só a FK precisa
    // bater com o tipo da tabela `users` já existente.
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    tokenHash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'token_hash',
    },
    family: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at',
    },
    revokedAt: {
      type: DataTypes.DATE,
      field: 'revoked_at',
    },
    replacedByTokenHash: {
      type: DataTypes.STRING,
      field: 'replaced_by_token_hash',
    },
    createdByIp: {
      type: DataTypes.STRING,
      field: 'created_by_ip',
    },
  },
  {
    tableName: 'refresh_tokens',
    underscored: true,
  }
);

User.hasMany(RefreshToken, { foreignKey: 'userId', onDelete: 'CASCADE' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });
