// Precisa espelhar exatamente server/src/models/product.model.js (PRODUCT_CATEGORIES) —
// o servidor rejeita qualquer valor de categoria fora dessa lista.
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
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
