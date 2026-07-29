import { Sequelize } from 'sequelize';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export const sequelize = new Sequelize({
  database: env.db.database,
  username: env.db.username,
  password: env.db.password,
  host: env.db.host,
  port: env.db.port,
  dialect: 'postgres',
  logging: env.isProduction ? false : (sql) => logger.debug(sql),
});
