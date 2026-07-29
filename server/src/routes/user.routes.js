import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { userService } from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

const router = Router();

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await userService.findById(req.auth.userId);
    if (!user) throw new AppError('Usuário não encontrado', 404);
    res.json({ user: userService.toPublicUser(user) });
  })
);

export default router;
