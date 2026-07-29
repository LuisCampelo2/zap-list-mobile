import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  loginRateLimit,
  registerRateLimit,
  activateRateLimit,
  passwordResetRateLimit,
} from '../middlewares/security.middleware.js';
import {
  registerSchema,
  activateSchema,
  loginSchema,
  refreshSchema,
  forgotPasswordSchema,
  verifyResetCodeSchema,
  resetPasswordSchema,
} from '../validators/auth.validators.js';

const router = Router();

router.post('/register', registerRateLimit, validate(registerSchema), authController.register);
router.post('/activate', activateRateLimit, validate(activateSchema), authController.activate);
router.post('/login', loginRateLimit, validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshSchema), authController.refresh);
router.post('/logout', validate(refreshSchema), authController.logout);
router.post(
  '/password/forgot',
  passwordResetRateLimit,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);
router.post(
  '/password/verify-code',
  passwordResetRateLimit,
  validate(verifyResetCodeSchema),
  authController.verifyResetCode
);
router.post(
  '/password/reset',
  passwordResetRateLimit,
  validate(resetPasswordSchema),
  authController.resetPassword
);

export default router;
