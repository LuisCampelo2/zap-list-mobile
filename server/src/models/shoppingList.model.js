import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { User } from './user.model.js';

/** Mapeia a tabela `shoppinglists` já existente (11 listas reais). */
export const ShoppingList = sequelize.define(
  'ShoppingList',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'userId',
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      field: 'totalPrice',
    },
  },
  {
    tableName: 'shoppinglists',
    timestamps: false,
  }
);

User.hasMany(ShoppingList, { foreignKey: 'userId', onDelete: 'CASCADE' });
ShoppingList.belongsTo(User, { foreignKey: 'userId' });
