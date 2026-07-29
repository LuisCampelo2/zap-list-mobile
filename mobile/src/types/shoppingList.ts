export type ShoppingListSummary = {
  id: number;
  name: string;
  totalPrice: number | null;
  itemCount: number;
};

export type ShoppingListItem = {
  id: number;
  quantity: number;
  isChecked: boolean;
  observation: string | null;
  product: {
    id: number;
    name: string;
    category: string;
    imageUrl: string | null;
    price: number | null;
    unitOfMeasure: string | null;
    unitOfCalculation: string | null;
  };
  subtotal: number | null;
};

export type ShoppingListDetail = {
  list: { id: number; name: string; totalPrice: number | null };
  items: ShoppingListItem[];
};
