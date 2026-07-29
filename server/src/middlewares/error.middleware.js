import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
};

/**
 * Handler central de erros: erros operacionais (AppError) mostram a mensagem
 * ao cliente; qualquer outro erro (bug, falha de infra) nunca vaza stack
 * trace/detalhes internos — só um 500 genérico, com o erro completo indo
 * para o log do servidor para investigação.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const isOperational = err.isOperational === true;
  const statusCode = isOperational ? err.statusCode : 500;
  const message = isOperational ? err.message : 'Erro interno do servidor';

  if (!isOperational) {
    logger.error(`${req.method} ${req.path} falhou`, { error: err.message, stack: err.stack });
  } else if (statusCode >= 500) {
    logger.error(`${req.method} ${req.path} -> ${statusCode}`, { message: err.message });
  }

  res.status(statusCode).json({
    message,
    ...(env.nodeEnv === 'development' && !isOperational ? { debug: err.message } : {}),
  });
};
