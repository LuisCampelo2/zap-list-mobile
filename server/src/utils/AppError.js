/**
 * Erro operacional (esperado) com status HTTP e mensagem segura para o cliente.
 * O error middleware distingue isOperational=true (mostra a mensagem) de erros
 * de programação/infra (nunca expõe detalhes, só um 500 genérico).
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
