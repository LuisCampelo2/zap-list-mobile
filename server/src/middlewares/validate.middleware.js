import { AppError } from '../utils/AppError.js';

/**
 * Valida (e normaliza — trim/lowercase/etc.) req.body/params/query contra um
 * schema Zod antes de o controller rodar. Isso é a linha de defesa central
 * contra payloads malformados, injeção via campos inesperados e XSS/SQLi por
 * tipos incorretos chegando às camadas de negócio/ORM.
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });

  if (!result.success) {
    const issues = result.error.issues.map((i) => i.message);
    return next(new AppError(issues[0] ?? 'Dados inválidos', 400));
  }

  req.body = result.data.body ?? req.body;
  req.params = result.data.params ?? req.params;
  // Express 5 tornou req.query somente leitura (getter derivado da URL) —
  // não dá mais para reatribuir a propriedade, então copiamos os valores
  // normalizados para dentro do objeto existente.
  if (result.data.query) Object.assign(req.query, result.data.query);
  next();
};
