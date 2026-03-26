import type {
  CartItem,
  CartTotals,
  Product,
} from "../../../../interfaces/POS/IPos";
import type { ProductoDto } from "../../../../interfaces/Products/FormProducts";

export const mapApiProductToPosProduct = (product: ProductoDto): Product => ({
  id: product.id,
  code: product.sku,
  name: product.nombre,
  category: product.categoria.nombre,
  price: Number(product.precioVenta),
  stock: product.inventarios?.[0]?.stockActual || 0,
  taxRate: Number(product.impuesto?.tasa ?? 0),
  taxName: product.impuesto?.nombre ?? "Impuesto",
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

export const calculateCartTotals = (cart: CartItem[]): CartTotals => {
  const subtotal = cart.reduce((sum, item) => sum + Number(item.subtotal), 0);
  const tax = cart.reduce(
    (sum, item) => sum + Number(item.subtotal) * Number(item.product.taxRate),
    0,
  );
  const total = subtotal + tax;

  return { subtotal, tax, total };
};

export const hasCartStockIssues = (cart: CartItem[]) =>
  cart.some((item) => item.quantity > item.product.stock);
