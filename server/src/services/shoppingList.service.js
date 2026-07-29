import { ShoppingList, ShoppingListProduct, Product } from '../models/index.js';
import { AppError } from '../utils/AppError.js';

const round2 = (value) => Math.round(value * 100) / 100;

/** Preço unitário efetivo: converte preço/KG para preço/peça via peso médio, quando aplicável. */
const unitPrice = (product) => {
  if (product.price === null) return null;
  if (product.averageWeightGrams) return (product.averageWeightGrams / 1000) * product.price;
  return product.price;
};

const toPublicItem = (item) => ({
  id: item.id,
  quantity: item.quantity,
  isChecked: item.isChecked,
  observation: item.observation,
  product: {
    id: item.Product.id,
    name: item.Product.name,
    category: item.Product.category,
    imageUrl: item.Product.photo ? `/images/products/${item.Product.photo.replace(/^\/+/, '')}` : null,
    price: item.Product.price,
    unitOfMeasure: item.Product.unitOfMeasure,
    unitOfCalculation: item.Product.unitOfCalculation,
  },
  subtotal: (() => {
    const price = unitPrice(item.Product);
    return price === null ? null : round2(price * item.quantity);
  })(),
});

async function getOwnedList(userId, listId) {
  const list = await ShoppingList.findOne({ where: { id: listId, userId } });
  if (!list) throw new AppError('Lista não encontrada', 404);
  return list;
}

export const shoppingListService = {
  async listForUser(userId) {
    const lists = await ShoppingList.findAll({ where: { userId }, order: [['id', 'DESC']] });
    const counts = await ShoppingListProduct.findAll({
      where: { shoppingListId: lists.map((l) => l.id) },
      attributes: ['shoppingListId'],
    });
    const countByList = counts.reduce((acc, row) => {
      acc[row.shoppingListId] = (acc[row.shoppingListId] ?? 0) + 1;
      return acc;
    }, {});

    return lists.map((l) => ({
      id: l.id,
      name: l.name,
      totalPrice: l.totalPrice === null ? null : Number(l.totalPrice),
      itemCount: countByList[l.id] ?? 0,
    }));
  },

  async create(userId, name) {
    const list = await ShoppingList.create({ userId, name });
    return { id: list.id, name: list.name, totalPrice: null, itemCount: 0 };
  },

  async delete(userId, listId) {
    const list = await getOwnedList(userId, listId);
    // FK real é ON DELETE NO ACTION — precisa apagar os itens antes da lista.
    await ShoppingListProduct.destroy({ where: { shoppingListId: list.id } });
    await list.destroy();
  },

  /** Recalcula e persiste o total da lista a partir dos itens atuais — chamado sempre que os itens mudam. */
  async recalculateTotal(listId) {
    const items = await ShoppingListProduct.findAll({
      where: { shoppingListId: listId },
      include: [Product],
    });

    const hasUnknownPrice = items.some((i) => unitPrice(i.Product) === null);
    const total = hasUnknownPrice
      ? null
      : round2(items.reduce((sum, i) => sum + unitPrice(i.Product) * i.quantity, 0));

    await ShoppingList.update({ totalPrice: total }, { where: { id: listId } });
    return { items, total };
  },

  async getItems(userId, listId) {
    const list = await getOwnedList(userId, listId);
    const { items, total } = await this.recalculateTotal(listId);

    return {
      list: { id: list.id, name: list.name, totalPrice: total },
      items: items.map(toPublicItem),
    };
  },

  async addItem(userId, listId, { productId, quantity, observation }) {
    await getOwnedList(userId, listId);

    const product = await Product.findByPk(productId);
    if (!product) throw new AppError('Produto não encontrado', 404);

    const qty = quantity ?? 1;
    if (product.unitOfMeasure !== 'KG' && !Number.isInteger(qty)) {
      throw new AppError('Quantidade deve ser um número inteiro para este produto', 400);
    }
    if (qty <= 0) throw new AppError('Quantidade deve ser maior que zero', 400);

    const existing = await ShoppingListProduct.findOne({
      where: { shoppingListId: listId, productId },
    });
    if (existing) throw new AppError('Este produto já está nessa lista', 409);

    const item = await ShoppingListProduct.create({
      shoppingListId: listId,
      productId,
      quantity: qty,
      observation: observation ?? null,
    });

    await this.recalculateTotal(listId);
    return item.id;
  },

  async updateItem(userId, listId, itemId, changes) {
    await getOwnedList(userId, listId);
    const item = await ShoppingListProduct.findOne({ where: { id: itemId, shoppingListId: listId } });
    if (!item) throw new AppError('Item não encontrado', 404);

    if (changes.quantity !== undefined) {
      const product = await Product.findByPk(item.productId);
      if (product.unitOfMeasure !== 'KG' && !Number.isInteger(changes.quantity)) {
        throw new AppError('Quantidade deve ser um número inteiro para este produto', 400);
      }
      if (changes.quantity <= 0) throw new AppError('Quantidade deve ser maior que zero', 400);
      item.quantity = changes.quantity;
    }
    if (changes.observation !== undefined) item.observation = changes.observation;
    if (changes.isChecked !== undefined) item.isChecked = changes.isChecked;

    await item.save();
    if (changes.quantity !== undefined) await this.recalculateTotal(listId);
  },

  async deleteItem(userId, listId, itemId) {
    await getOwnedList(userId, listId);
    const item = await ShoppingListProduct.findOne({ where: { id: itemId, shoppingListId: listId } });
    if (!item) throw new AppError('Item não encontrado', 404);
    await item.destroy();
    await this.recalculateTotal(listId);
  },
};
