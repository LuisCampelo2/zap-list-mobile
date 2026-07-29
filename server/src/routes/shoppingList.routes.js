import { Router } from 'express';
import { shoppingListController } from '../controllers/shoppingList.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createListSchema,
  listIdParamSchema,
  itemIdParamSchema,
  addItemSchema,
  updateItemSchema,
} from '../validators/shoppingList.validators.js';

const router = Router();

router.use(requireAuth);

router.get('/', shoppingListController.listLists);
router.post('/', validate(createListSchema), shoppingListController.createList);
router.delete('/:id', validate(listIdParamSchema), shoppingListController.deleteList);

router.get('/:id/items', validate(listIdParamSchema), shoppingListController.getItems);
router.post('/:id/items', validate(addItemSchema), shoppingListController.addItem);
router.patch('/:id/items/:itemId', validate(updateItemSchema), shoppingListController.updateItem);
router.delete('/:id/items/:itemId', validate(itemIdParamSchema), shoppingListController.deleteItem);

export default router;
