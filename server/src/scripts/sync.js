import { sequelize } from '../config/database.js';
import '../models/index.js';
import { logger } from '../utils/logger.js';

/**
 * Script de conveniência para desenvolvimento local (`npm run db:sync`).
 * Em produção, alterações de schema devem ir por migrations versionadas
 * (Sequelize CLI) — `sync({ alter: true })` nunca deve rodar contra prod.
 */
try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  logger.info('Banco de dados sincronizado com sucesso.');
  process.exit(0);
} catch (error) {
  logger.error('Falha ao sincronizar banco de dados', error);
  process.exit(1);
}
