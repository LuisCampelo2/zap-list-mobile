import { Product, Favorite } from '../models/index.js';
import { AppError } from '../utils/AppError.js';

// Coluna legada guarda o nome do arquivo com uma barra inicial (ex: "/banana.png").
const toImageUrl = (photo) => (photo ? `/images/products/${photo.replace(/^\/+/, '')}` : null);

const toPublicProduct = (product, favoritedIds = new Set()) => ({
  id: product.id,
  name: product.name,
  category: product.category,
  imageUrl: toImageUrl(product.photo),
  price: product.price,
  averageWeightGrams: product.averageWeightGrams,
  unitOfMeasure: product.unitOfMeasure,
  unitOfCalculation: product.unitOfCalculation,
  isFavorite: favoritedIds.has(product.id),
});

export const productService = {
  async list({ category, userId } = {}) {
    const products = await Product.findAll({
      where: category ? { category } : undefined,
      order: [['name', 'ASC']],
    });

    const favoritedIds = userId ? await this.getFavoriteIds(userId) : new Set();
    return products.map((p) => toPublicProduct(p, favoritedIds));
  },

  async getFavoriteIds(userId) {
    const favorites = await Favorite.findAll({ where: { userId }, attributes: ['productId'] });
    return new Set(favorites.map((f) => f.productId));
  },

  async listFavorites(userId) {
    const favorites = await Favorite.findAll({ where: { userId }, include: [Product] });
    const favoritedIds = new Set(favorites.map((f) => f.productId));
    return favorites
      .filter((f) => f.Product)
      .map((f) => toPublicProduct(f.Product, favoritedIds));
  },

  /** Retorna o novo estado (true = favoritado) — idempotente do ponto de vista do cliente. */
  async toggleFavorite(userId, productId) {
    const product = await Product.findByPk(productId);
    if (!product) throw new AppError('Produto não encontrado', 404);

    const existing = await Favorite.findOne({ where: { userId, productId } });
    if (existing) {
      await existing.destroy();
      return false;
    }
    await Favorite.create({ userId, productId });
    return true;
  },

  toPublicProduct,
};
