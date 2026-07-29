import { productService } from '../services/product.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const list = asyncHandler(async (req, res) => {
  const { category } = req.query;
  // req.auth só existe se um access token válido foi enviado — a listagem é
  // pública, mas se o usuário estiver logado já devolvemos `isFavorite` para
  // evitar uma segunda chamada só para marcar os corações no catálogo.
  const products = await productService.list({ category, userId: req.auth?.userId });
  res.json({ products });
});

const listFavorites = asyncHandler(async (req, res) => {
  const products = await productService.listFavorites(req.auth.userId);
  res.json({ products });
});

const toggleFavorite = asyncHandler(async (req, res) => {
  const isFavorite = await productService.toggleFavorite(req.auth.userId, req.params.id);
  res.json({ isFavorite });
});

export const productsController = {
  list,
  listFavorites,
  toggleFavorite,
};
