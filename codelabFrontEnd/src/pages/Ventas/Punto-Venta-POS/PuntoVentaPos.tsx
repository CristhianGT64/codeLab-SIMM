import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faMinus,
  faTrash,
  faShoppingCart,
  faCheckCircle,
  faExclamationTriangle,
  faBox,
  faUser,
  faHashtag,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import useListProduct from "../../../hooks/ProductosHooks/useListProduct";
import type { ProductoDto } from "../../../interfaces/Products/FormProducts";

interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

interface Sale {
  id: string;
  saleNumber: number;
  date: string;
  cashier: string;
  items: CartItem[];
  subtotal: number;
  total: number;
}

export function POSMain() {

  /* Hooks */
  const ListProducts = useListProduct();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [products, setProducts] = useState<Product[]>([]);


  // Sincronizar productos desde la API
  useEffect(() => {
    if (ListProducts.data?.success) {
      const mappedProducts: Product[] = ListProducts.data.data.map((p) => ({
        id: p.id,
        code: p.sku,
        name: p.nombre,
        category: p.categoria.nombre,
        price: p.precioVenta,
        stock: p.inventarios[0]?.stockActual || 0,
      }));
      setProducts(mappedProducts);
    }
  }, [ListProducts.data]);


  // Search products
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.code.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term),
    );
    setSearchResults(results);
  }, [searchTerm, products]);

  // Add product to cart
  const addToCart = (product: Product) => {
    if (product.stock === 0) {
      toast.error("Stock insuficiente", {
        description: `El producto "${product.name}" no tiene stock disponible`,
      });
      return;
    }

    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast.error("Stock insuficiente", {
          description: `Solo hay ${product.stock} unidades disponibles`,
        });
        return;
      }
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        product,
        quantity: 1,
        subtotal: product.price,
      };
      setCart([...cart, newItem]);
      toast.success("Producto agregado", {
        description: `${product.name} agregado a la venta`,
      });
    }

    setSearchTerm("");
  };

  // Update quantity
  const updateQuantity = (productId: string, newQuantity: number) => {
    const item = cart.find((item) => item.product.id === productId);

    if (!item) return;

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQuantity > item.product.stock) {
      toast.error("Stock insuficiente", {
        description: `Solo hay ${item.product.stock} unidades disponibles`,
      });
      return;
    }

    setCart(
      cart.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: newQuantity,
              subtotal: newQuantity * item.product.price,
            }
          : item,
      ),
    );
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
    toast.info("Producto eliminado de la venta");
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const total = subtotal; // Aquí se podría agregar ISV u otros impuestos
    return { subtotal, total };
  };

  // Complete sale
  const completeSale = () => {
    if (cart.length === 0) {
      toast.error("Venta vacía", {
        description: "Debe agregar al menos un producto a la venta",
      });
      return;
    }

    // Validate stock for all items
    const hasStockIssues = cart.some(
      (item) => item.quantity > item.product.stock,
    );
    if (hasStockIssues) {
      toast.error("Error de stock", {
        description:
          "Algunos productos tienen cantidades que exceden el stock disponible",
      });
      return;
    }

    setShowConfirmModal(true);
  };

  // Confirm sale
  const confirmSale = () => {
    const totals = calculateTotals();
    const sale: Sale = {
      id: Date.now().toString(),
      saleNumber: Math.floor(Math.random() * 10000) + 1000,
      date: new Date().toISOString(),
      cashier: "Usuario Cajero", // En producción vendría del contexto
      items: cart,
      subtotal: totals.subtotal,
      total: totals.total,
    };

    // Actualizar stock de forma inmutable
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const cartItem = cart.find((item) => item.product.id === p.id);
        return cartItem ? { ...p, stock: p.stock - cartItem.quantity } : p;
      }),
    );

    setCompletedSale(sale);
    setShowConfirmModal(false);
    setCart([]);
    setSearchTerm("");

    toast.success("Venta registrada correctamente", {
      description: `Venta #${sale.saleNumber} - Total: L ${sale.total.toFixed(2)}`,
    });
  };

  // Cancel sale
  const cancelSale = () => {
    if (cart.length > 0) {
      if (window.confirm("¿Está seguro que desea cancelar esta venta?")) {
        setCart([]);
        setSearchTerm("");
        toast.info("Venta cancelada");
      }
    }
  };

  const totals = calculateTotals();

  // If sale completed, show success screen
  if (completedSale) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-5xl text-green-600"
              />
            </div>
            <h2 className="text-3xl font-bold text-[#114c6f] mb-2">
              ¡Venta Registrada!
            </h2>
            <p className="text-lg text-[#4a6eb0] mb-6">
              Venta #{completedSale.saleNumber} completada exitosamente
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-left">
                  <div className="text-sm text-[#4a6eb0]">Fecha</div>
                  <div className="font-semibold text-[#114c6f]">
                    {new Date(completedSale.date).toLocaleString("es-HN")}
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm text-[#4a6eb0]">Cajero</div>
                  <div className="font-semibold text-[#114c6f]">
                    {completedSale.cashier}
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#4a6eb0]">Subtotal:</span>
                  <span className="font-semibold text-[#114c6f]">
                    L {completedSale.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-[#114c6f]">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-[#079f9b]">
                    L {completedSale.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCompletedSale(null)}
              className="w-full px-6 py-4 bg-gradient-to-r from-[#079f9b] to-[#4a6eb0] text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Nueva Venta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      <div className="max-w-7xl mx-auto h-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-[#079f9b] to-[#4a6eb0] rounded-2xl">
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  className="text-2xl text-white"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#114c6f] mb-2">
                  Punto de Venta
                </h1>
                <p className="text-[#4a6eb0]">
                  Registra ventas de forma rápida y eficiente
                </p>
              </div>
            </div>
            {cart.length > 0 && (
              <button
                onClick={cancelSale}
                className="px-4 py-2 border-2 border-red-400 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Cancelar Venta
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
          {/* Left Panel - Product Search */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-4">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4a6eb0]"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, código o categoría..."
                  className="w-full pl-12 pr-4 py-4 border-2 border-[#9cd2d3] rounded-xl focus:outline-none focus:border-[#079f9b] transition-colors text-lg"
                  autoFocus
                />
              </div>
            </div>

            {/* Search Results */}
            <div className="bg-white rounded-xl shadow-md flex-1 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-[#114c6f]">
                  {searchTerm
                    ? "Resultados de Búsqueda"
                    : "Productos Disponibles"}
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {searchTerm === "" ? (
                  <div className="text-center py-12 text-[#4a6eb0]">
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="text-6xl mx-auto mb-4 opacity-50"
                    />
                    <p className="text-lg">
                      Busca productos por nombre, código o categoría
                    </p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-12">
                    <FontAwesomeIcon
                      icon={faBox}
                      className="text-6xl mx-auto mb-4 text-gray-400"
                    />
                    <p className="text-lg text-[#4a6eb0] mb-2">
                      No se encontraron resultados
                    </p>
                    <p className="text-sm text-gray-500">
                      Intenta con otro término de búsqueda
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          product.stock === 0
                            ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                            : "border-[#9cd2d3] hover:border-[#079f9b] hover:bg-[#079f9b]/5"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-[#114c6f] mb-1">
                              {product.name}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-[#4a6eb0]">
                              <span className="flex items-center gap-1">
                                <FontAwesomeIcon
                                  icon={faHashtag}
                                  className="text-xs"
                                />
                                {product.code}
                              </span>
                              <span className="flex items-center gap-1">
                                <FontAwesomeIcon
                                  icon={faTag}
                                  className="text-xs"
                                />
                                {product.category}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-[#079f9b]">
                              L {product.price}
                            </div>
                            <div
                              className={`text-xs font-semibold ${product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-amber-600" : "text-red-600"}`}
                            >
                              {product.stock > 0
                                ? `Stock: ${product.stock}`
                                : "Sin stock"}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Cart */}
          <div className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-[#079f9b] to-[#4a6eb0] text-white">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <FontAwesomeIcon icon={faShoppingCart} />
                Carrito ({cart.length})
              </h2>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-[#4a6eb0]">
                  <FontAwesomeIcon
                    icon={faShoppingCart}
                    className="text-6xl mx-auto mb-4 opacity-50"
                  />
                  <p>No hay productos en la venta</p>
                  <p className="text-sm mt-2">
                    Busca y agrega productos para comenzar
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className={`p-3 rounded-lg border-2 ${
                        item.quantity > item.product.stock
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-semibold text-[#114c6f] text-sm">
                            {item.product.name}
                          </div>
                          <div className="text-xs text-[#4a6eb0]">
                            {item.product.code}
                          </div>
                          <div className="text-sm font-semibold text-[#079f9b] mt-1">
                            L {item.product.price.toFixed(2)} c/u
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                        </button>
                      </div>

                      {item.quantity > item.product.stock && (
                        <div className="bg-red-100 border border-red-400 rounded p-2 mb-2 flex items-center gap-2">
                          <FontAwesomeIcon
                            icon={faExclamationTriangle}
                            className="text-red-600 flex-shrink-0"
                          />
                          <span className="text-xs text-red-800">
                            Stock insuficiente (disponible: {item.product.stock}
                            )
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-1 hover:bg-white rounded transition-colors"
                          >
                            <FontAwesomeIcon
                              icon={faMinus}
                              className="text-[#4a6eb0]"
                            />
                          </button>
                          <span className="w-8 text-center font-semibold text-[#114c6f]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-white rounded transition-colors"
                          >
                            <FontAwesomeIcon
                              icon={faPlus}
                              className="text-[#4a6eb0]"
                            />
                          </button>
                        </div>
                        <div className="text-lg font-bold text-[#079f9b]">
                          L {item.subtotal.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Totals and Actions */}
            <div className="p-4 border-t-2 border-gray-200">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#4a6eb0]">Subtotal:</span>
                  <span className="text-lg font-semibold text-[#114c6f]">
                    L {totals.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t-2 border-gray-300">
                  <span className="text-xl font-bold text-[#114c6f]">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-[#079f9b]">
                    L {totals.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={completeSale}
                disabled={cart.length === 0}
                className={`w-full px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  cart.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#079f9b] to-[#4a6eb0] text-white hover:shadow-lg"
                }`}
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                Finalizar Venta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#079f9b] to-[#4a6eb0] p-6 text-center">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-3xl text-[#079f9b]"
                />
              </div>
              <h2 className="text-2xl font-bold text-white">Confirmar Venta</h2>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-bold text-[#114c6f] mb-3">
                  Resumen de la Venta
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faUser} className="text-[#4a6eb0]" />
                    <span className="text-sm text-[#4a6eb0]">Cajero:</span>
                    <span className="font-semibold text-[#114c6f]">
                      Usuario Cajero
                    </span>
                  </div>
                  <div className="text-xs text-[#4a6eb0]">
                    {new Date().toLocaleString("es-HN")}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-[#114c6f]">
                        {item.product.name} x {item.quantity}
                      </span>
                      <span className="font-semibold text-[#079f9b]">
                        L {item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#4a6eb0]">Subtotal:</span>
                    <span className="font-semibold text-[#114c6f]">
                      L {totals.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-[#114c6f]">
                      Total a Pagar:
                    </span>
                    <span className="text-2xl font-bold text-[#079f9b]">
                      L {totals.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-[#9cd2d3] text-[#4a6eb0] rounded-xl font-semibold hover:bg-[#9cd2d3]/20 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmSale}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#079f9b] to-[#4a6eb0] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Confirmar Venta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
