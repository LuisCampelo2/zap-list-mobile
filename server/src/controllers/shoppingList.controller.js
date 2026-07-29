import { shoppingListService } from '../services/shoppingList.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const listLists = asyncHandler(async (req, res) => {
  const lists = await shoppingListService.listForUser(req.auth.userId);
  res.json({ lists });
});

const createList = asyncHandler(async (req, res) => {
  const list = await shoppingListService.create(req.auth.userId, req.body.name);
  res.status(201).json({ list });
});

const deleteList = asyncHandler(async (req, res) => {
  await shoppingListService.delete(req.auth.userId, req.params.id);
  res.status(204).send();
});

const getItems = asyncHandler(async (req, res) => {
  const result = await shoppingListService.getItems(req.auth.userId, req.params.id);
  res.json(result);
});

const addItem = asyncHandler(async (req, res) => {
  const itemId = await shoppingListService.addItem(req.auth.userId, req.params.id, req.body);
  res.status(201).json({ message: 'Produto adicionado à lista', itemId });
});

const updateItem = asyncHandler(async (req, res) => {
  await shoppingListService.updateItem(req.auth.userId, req.params.id, req.params.itemId, req.body);
  res.json({ message: 'Item atualizado' });
});

const deleteItem = asyncHandler(async (req, res) => {
  await shoppingListService.deleteItem(req.auth.userId, req.params.id, req.params.itemId);
  res.status(204).send();
});

export const shoppingListController = {
  listLists,
  createList,
  deleteList,
  getItems,
  addItem,
  updateItem,
  deleteItem,
};
