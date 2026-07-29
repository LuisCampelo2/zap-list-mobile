import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

// Mesmas ~22 categorias já existentes na tabela `products` real (enum
// `enum_products_category` no banco) — precisa continuar batendo exatamente
// com os valores já gravados nas 213 linhas existentes.
export const PRODUCT_CATEGORIES = [
  'Conservas e enlatados',
  'Grãos',
  'Chás e cafés',
  'Farinhas e derivados',
  'Congelados',
  'Biscoitos e salgadinhos',
  'Utensílios de cozinha',
  'Açúcares e adoçantes',
  'Frutas',
  'Verduras',
  'Legumes',
  'Carnes',
  'Peixes',
  'Massas',
  'Laticínios e ovos',
  'Padaria',
  'Temperos e especiarias',
  'Doces e guloseimas',
  'Bebidas',
  'Material de higiene',
  'Material de limpeza',
  'Itens pra cachorro',
  'Outros',
];

export const UNITS = ['KG', 'Pacote', 'Unidade'];

/**
 * Mapeia a tabela `products` já existente (213 produtos reais) do banco
 * original do Zap-List — não um schema novo. Nomes de coluna preservam até
 * o typo histórico `unitOFMeasure` (O e F maiúsculos) porque é exatamente
 * como a coluna foi criada lá.
 */
export const Product = sequelize.define(
  'Product',
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
    category: {
      type: DataTypes.ENUM,
      values: PRODUCT_CATEGORIES,
      allowNull: false,
    },
    // Coluna existente "photo" guarda o nome do arquivo, ex: "/banana.png"
    // (com barra inicial) — normalizado para URL em product.service.js.
    photo: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DOUBLE,
    },
    // Peso médio em gramas — usado para converter preço por KG em preço por
    // unidade quando o produto é contado por peça mas vendido a granel/peso.
    averageWeightGrams: {
      type: DataTypes.DOUBLE,
      field: 'averageWeight',
    },
    unitOfMeasure: {
      type: DataTypes.ENUM,
      values: UNITS,
      field: 'unitOFMeasure',
    },
    unitOfCalculation: {
      type: DataTypes.ENUM,
      values: UNITS,
      field: 'unitOfCalculation',
    },
  },
  {
    tableName: 'products',
    timestamps: false,
  }
);
