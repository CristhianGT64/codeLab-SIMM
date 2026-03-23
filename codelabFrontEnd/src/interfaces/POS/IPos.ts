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

export interface SaleRequest {
  usuarioId: string | number;
  sucursalId: string | number;
  productos: {
    productoId: string | number;
    cantidad: number;
  }[];
}

export interface SaleResponse {
  success: boolean;
  data: {
    id: string;
    total: string;
    estado: string;
    createdAt: string | null;
    clienteId: string | null;
    usuarioId: string;
    sucursalId: string;
  };
}