import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import productsRoutes from './products.routes.js';
import shoppingListRoutes from './shoppingList.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productsRoutes);
router.use('/lists', shoppingListRoutes);

export default router;
