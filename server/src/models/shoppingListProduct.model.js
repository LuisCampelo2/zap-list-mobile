import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { ShoppingList } from './shoppingList.model.js';
import { Product } from './product.model.js';

/** Mapeia a tabela `shoppinglistproducts` já existente (299 itens reais) — um item de uma lista. */
export const ShoppingListProduct = sequelize.define(
  'ShoppingListProduct',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.DOUBLE,
    },
    isChecked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'isChecked',
    },
    observation: {
      type: DataTypes.TEXT,
    },
    shoppingListId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'shoppingListId',
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'productId',
    },
  },
  {
    tableName: 'shoppinglistproducts',
    timestamps: false,
  }
);

// A FK real no banco é ON DELETE NO ACTION (não CASCADE) — apagar uma lista
// exige apagar seus itens primeiro, manualmente (ver shoppingList.service.js).
ShoppingList.hasMany(ShoppingListProduct, { foreignKey: 'shoppingListId' });
ShoppingListProduct.belongsTo(ShoppingList, { foreignKey: 'shoppingListId' });
Product.hasMany(ShoppingListProduct, { foreignKey: 'productId' });
ShoppingListProduct.belongsTo(Product, { foreignKey: 'productId' });
