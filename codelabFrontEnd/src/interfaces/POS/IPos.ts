export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  saleNumber: number;
  date: string;
  cashier: string;
  items: CartItem[];
  subtotal: number;
  total: number;
}