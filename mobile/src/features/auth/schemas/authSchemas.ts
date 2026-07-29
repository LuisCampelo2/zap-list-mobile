import { z } from 'zod';

// Mesma política aplicada no server (server/src/validators/auth.validators.js) —
// mantém as duas camadas de validação consistentes para o usuário nunca ver
// um erro só depois do round-trip para a API.
const passwordSchema = z
  .string()
  .min(8, 'Mínimo de 8 caracteres')
  .regex(/[a-z]/, 'Inclua uma letra minúscula')
  .regex(/[A-Z]/, 'Inclua uma letra maiúscula')
  .regex(/\d/, 'Inclua um número')
  .regex(/[\W_]/, 'Inclua um caractere especial');

export const loginSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(1, 'Informe sua senha'),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Informe seu nome'),
    lastName: z.string().trim().min(1, 'Informe seu sobrenome'),
    email: z.email('Email inválido'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });
export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email('Email inválido'),
});
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const verifyCodeSchema = z.object({
  code: z.string().length(6, 'O código tem 6 dígitos'),
});
export type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
