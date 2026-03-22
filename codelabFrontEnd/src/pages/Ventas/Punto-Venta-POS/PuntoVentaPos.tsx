import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import useListProduct from "../../../hooks/ProductosHooks/useListProduct";
import type { CartItem, Product, Sale } from "../../../interfaces/POS/IPos";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import { bottonEliminar, HeaderPOS } from "../../../data/dataAdministrator/POSData";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";
import { VentaRegistrada } from "../../../components/POS/VentaRegistrada";
import ConfirmarVentas from "../../../components/POS/ConfirmarVenta";
import CarritoVenta from "../../../components/POS/CarritoVenta";
import TotalSubTotalVenta from "../../../components/POS/TotalSubTotalVenta";
import ResultadosVenta from "../../../components/POS/ResultadosVenta";

export function POSMain() {
  /* Hooks */
  const ListProducts = useListProduct();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
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

  //  Buscar Produtos
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

  // Agregar producto al carrito
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

  // Actualizar cantidad
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

  // Eliminar producto del carrito
  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
    toast.info("Producto eliminado de la venta");
  };

  // Calcular totales
  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const total = subtotal; // Aquí se podría agregar ISV u otros impuestos
    return { subtotal, total };
  };

  // Completar venta
  const completeSale = () => {
    if (cart.length === 0) {
      toast.error("Venta vacía", {
        description: "Debe agregar al menos un producto a la venta",
      });
      return;
    }

    // Validar stock para todos los productos
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

  // Confirmar venta
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

  // Cancelar venta
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

  // Si la venta se completó, mostrar pantalla de éxito
  if (completedSale) {
    return (
      <VentaRegistrada
        completedSale={completedSale}
        setCompletedSale={setCompletedSale}
      />
    );
  }

  /* Comeinzo de POS */
  return (
    <div className="p-6 h-full">
      <div className="max-w-7xl mx-auto h-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-linear-to-br from-[#079f9b] to-[#4a6eb0] rounded-2xl">
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  className="text-2xl text-white"
                />
              </div>
              <HeaderTitleAdmin {...HeaderPOS} />
            </div>
            {cart.length > 0 && (
              <ButtonsComponet {...bottonEliminar} onClick={cancelSale} />
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
          {/* Left Panel - Product Search */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-4">
              {" "}
              {/* Buscador */}
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
            </div>{" "}
            {/* Final de buscador */}
            {/* Search Results */}
            <ResultadosVenta
              searchTerm={searchTerm}
              searchResults={searchResults}
              addToCart={addToCart}
            />
            {/* Final de resultados de busqueda */}
          </div>

          {/* Carrito */}
          <div className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-linear-to-r from-[#079f9b] to-[#4a6eb0] text-white">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <FontAwesomeIcon icon={faShoppingCart} />
                Carrito ({cart.length})
              </h2>
            </div>

            {/* Cart Items */}
            <CarritoVenta
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />

            {/* Total y acciones */}
            <TotalSubTotalVenta
              cart={cart}
              totals={totals}
              completeSale={completeSale}
            />
          </div>
        </div>
      </div>
      {/* Confimacion de venta */}
      {showConfirmModal && (
        <ConfirmarVentas
          cart={cart}
          totals={totals}
          confirmSale={confirmSale}
          setShowConfirmModal={setShowConfirmModal}
        />
      )}{" "}
      {/* Final de la confirmacion de venta */}
    </div>
  );
}
