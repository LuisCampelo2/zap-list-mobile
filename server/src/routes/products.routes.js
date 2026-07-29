import { Router } from 'express';
import { productsController } from '../controllers/products.controller.js';
import { requireAuth, attachAuthIfPresent } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { listProductsSchema, productIdParamSchema } from '../validators/products.validators.js';

const router = Router();

router.get('/', attachAuthIfPresent, validate(listProductsSchema), productsController.list);
router.get('/favorites', requireAuth, productsController.listFavorites);
router.post(
  '/:id/favorite',
  requireAuth,
  validate(productIdParamSchema),
  productsController.toggleFavorite
);

export default router;
