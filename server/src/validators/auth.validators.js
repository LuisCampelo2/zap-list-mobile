import { z } from 'zod';

// Mesma política de senha do app original: 8+ chars, maiúscula, minúscula, número e símbolo.
const passwordSchema = z
  .string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres')
  .regex(/[a-z]/, 'A senha deve conter uma letra minúscula')
  .regex(/[A-Z]/, 'A senha deve conter uma letra maiúscula')
  .regex(/\d/, 'A senha deve conter um número')
  .regex(/[\W_]/, 'A senha deve conter um caractere especial');

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.string().trim().toLowerCase().email().max(255),
    password: passwordSchema,
  }),
});

export const activateSchema = z.object({
  body: z.object({
    token: z.string().min(1),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(1),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email(),
  }),
});

export const verifyResetCodeSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email(),
    code: z.string().length(6),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    resetToken: z.string().min(1),
    password: passwordSchema,
  }),
});
