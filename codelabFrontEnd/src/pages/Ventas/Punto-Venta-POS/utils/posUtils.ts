import type { CartItem, Product } from "../../../../interfaces/POS/IPos";

export const mapApiProductToPosProduct = (product: {
  id: string;
  sku: string;
  nombre: string;
  categoria: { nombre: string };
  precioVenta: number;
  inventarios?: Array<{ stockActual?: number }>;
}): Product => ({
  id: product.id,
  code: product.sku,
  name: product.nombre,
  category: product.categoria.nombre,
  price: product.precioVenta,
  stock: product.inventarios?.[0]?.stockActual || 0,
});

export const filterProducts = (
  products: Product[],
  searchTerm: string,
): Product[] => {
  const normalizedTerm = searchTerm.trim().toLowerCase();

  if (!normalizedTerm) {
    return [];
  }

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(normalizedTerm) ||
      product.code.toLowerCase().includes(normalizedTerm) ||
      product.category.toLowerCase().includes(normalizedTerm),
  );
};

export const calculateCartTotals = (cart: CartItem[]) => {
  const subtotal = cart.reduce((sum, item) => sum + Number(item.subtotal), 0);
  const total = subtotal;

  return { subtotal, total };
};

export const hasCartStockIssues = (cart: CartItem[]) =>
  cart.some((item) => item.quantity > item.product.stock);
