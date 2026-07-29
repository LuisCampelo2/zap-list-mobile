import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import {
  corsMiddleware,
  helmetMiddleware,
  generalRateLimit,
} from './middlewares/security.middleware.js';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const app = express();

// `trust proxy` é necessário para que req.ip (usado no rate limiter e nos
// logs de refresh token) reflita o IP real do cliente atrás de um proxy/load
// balancer, em vez do IP interno do proxy.
app.set('trust proxy', 1);

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json({ limit: '1mb' }));
app.use(generalRateLimit);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// crossOriginResourcePolicy 'cross-origin' só nas imagens: o app mobile (e um
// eventual client web) precisa poder carregá-las fora da origem do server;
// o resto da API mantém o padrão mais restrito do helmet.
app.use(
  '/images/products',
  (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(path.join(__dirname, 'imgs'), { maxAge: '7d' })
);

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);
