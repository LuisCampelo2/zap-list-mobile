import { app } from './app.js';
import { env } from './config/env.js';
import { sequelize } from './config/database.js';
import './models/index.js';
import { logger } from './utils/logger.js';

try {
  await sequelize.authenticate();
  logger.info('Conexão com o banco de dados estabelecida.');
} catch (error) {
  logger.error('Não foi possível conectar ao banco de dados.', error);
  process.exit(1);
}

app.listen(env.port, () => {
  logger.info(`Servidor rodando na porta ${env.port} (${env.nodeEnv})`);
});
