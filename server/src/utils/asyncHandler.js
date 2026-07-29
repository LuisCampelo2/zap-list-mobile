/**
 * Evita repetir try/catch em cada controller: qualquer rejeição da Promise
 * é encaminhada ao error middleware central em vez de derrubar o processo
 * (Express 5 já faz isso para async, mas manter explícito documenta a intenção
 * e funciona também caso o app precise rodar em modo compatível no futuro).
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
