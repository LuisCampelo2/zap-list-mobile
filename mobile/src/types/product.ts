import type { ProductCategory } from '../features/products/constants/categories';

export type Unit = 'KG' | 'Pacote' | 'Unidade';

export type Product = {
  id: number;
  name: string;
  category: ProductCategory;
  imageUrl: string | null;
  price: number | null;
  averageWeightGrams: number | null;
  unitOfMeasure: Unit | null;
  unitOfCalculation: Unit | null;
  isFavorite: boolean;
};
