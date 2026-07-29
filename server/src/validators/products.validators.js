import { z } from 'zod';
import { PRODUCT_CATEGORIES } from '../models/product.model.js';

export const listProductsSchema = z.object({
  query: z.object({
    category: z.enum(PRODUCT_CATEGORIES).optional(),
  }),
});

export const productIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('Produto inválido'),
  }),
});
