/**
 * Logger mínimo e centralizado. Existe para garantir um único ponto de saída
 * de logs — se no futuro trocarmos por Pino/Winston, só este arquivo muda.
 * Nunca logar body de requisições ou objetos de usuário/token diretamente:
 * sempre passar campos específicos e não sensíveis.
 */
const timestamp = () => new Date().toISOString();

export const logger = {
  info: (message, meta) => console.log(`[${timestamp()}] INFO  ${message}`, meta ?? ''),
  warn: (message, meta) => console.warn(`[${timestamp()}] WARN  ${message}`, meta ?? ''),
  error: (message, meta) => console.error(`[${timestamp()}] ERROR ${message}`, meta ?? ''),
  debug: (message, meta) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[${timestamp()}] DEBUG ${message}`, meta ?? '');
    }
  },
};
