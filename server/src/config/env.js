import 'dotenv/config';
import { z } from 'zod';

/**
 * Falha rápido na inicialização se algum segredo obrigatório estiver ausente,
 * em vez de deixar o servidor subir com JWT_ACCESS_SECRET undefined (o que
 * tornaria a assinatura de tokens previsível/inválida em runtime).
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  APP_SCHEME: z.string().min(1).default('zaplist'),

  PGDATABASE: z.string().min(1),
  PGUSER: z.string().min(1),
  PGPASSWORD: z.string().default(''),
  PGHOST: z.string().min(1),
  PGPORT: z.coerce.number().int().positive().default(5432),

  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET deve ter pelo menos 32 caracteres'),
  JWT_REFRESH_PEPPER: z.string().min(32, 'JWT_REFRESH_PEPPER deve ter pelo menos 32 caracteres'),

  SENDGRID_API_KEY: z.string().optional(),
  SENDGRID_FROM_EMAIL: z.string().email().default('zaplistbusiness@gmail.com'),

  CORS_ALLOWED_ORIGINS: z.string().default(''),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Configuração de ambiente inválida:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const data = parsed.data;

export const env = {
  nodeEnv: data.NODE_ENV,
  isProduction: data.NODE_ENV === 'production',
  port: data.PORT,
  appScheme: data.APP_SCHEME,
  db: {
    database: data.PGDATABASE,
    username: data.PGUSER,
    password: data.PGPASSWORD,
    host: data.PGHOST,
    port: data.PGPORT,
  },
  jwt: {
    accessSecret: data.JWT_ACCESS_SECRET,
    refreshPepper: data.JWT_REFRESH_PEPPER,
  },
  sendgrid: {
    apiKey: data.SENDGRID_API_KEY,
    fromEmail: data.SENDGRID_FROM_EMAIL,
  },
  corsAllowedOrigins: data.CORS_ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean),
};
