import { useMemo, useState } from "react";
import { toast } from "sonner";
import useReadCaiVigente from "../../../../hooks/CaiHooks/useReadCaiVigente";
import useListProduct from "../../../../hooks/ProductosHooks/useListProduct";
import { useCreateVenta } from "../../../../hooks/POSHooks/useCreateVenta";
import { useCreateFactura } from "../../../../hooks/POSHooks/useCreateFactura";
import useAuth from "../../../../hooks/useAuth";
import type {
  CartItem,
  CartTotals,
  Product,
  Sale,
  SaleResponse,
} from "../../../../interfaces/POS/IPos";
import {
  calculateCartTotals,
  filterProducts,
  hasCartStockIssues,
  mapApiProductToPosProduct,
} from "../utils/posUtils";
import { getCaiPosBlockInfo } from "../../../../utils/caiUtils";

export const usePosController = () => {
  const listProducts = useListProduct();
  const createVentaMutation = useCreateVenta();
  const createFacturaMutation = useCreateFactura();
  const { user, permisos } = useAuth();
  const { data: caiVigenteData, isLoading: isLoadingCaiVigente } =
    useReadCaiVigente();

  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const caiVigente = caiVigenteData?.data;
  const caiBlockInfo = useMemo(
    () =>
      isLoadingCaiVigente
        ? {
            title: "POS bloqueado temporalmente",
            message:
              "Se está validando el CAI vigente. Espera un momento e inténtalo nuevamente.",
          }
        : getCaiPosBlockInfo(caiVigente),
    [caiVigente, isLoadingCaiVigente],
  );

  const notifyCaiBlocked = () => {
    if (!caiBlockInfo) {
      return false;
    }

    toast.error(caiBlockInfo.title, {
      description: caiBlockInfo.message,
    });

    return true;
  };

  const products = useMemo<Product[]>(
    () =>
      listProducts.data?.success
        ? listProducts.data.data.map(mapApiProductToPosProduct)
        : [],
    [listProducts.data],
  );

  const searchResults = useMemo(
    () => filterProducts(products, searchTerm),
    [products, searchTerm],
  );

  const totals = useMemo<CartTotals>(() => calculateCartTotals(cart), [cart]);

  const removeFromCart = (productId: string) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.product.id !== productId),
    );
    toast.info("Producto eliminado de la venta");
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const currentItem = cart.find((item) => item.product.id === productId);

    if (!currentItem) return;

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQuantity > currentItem.product.stock) {
      toast.error("Stock insuficiente", {
        description: `Solo hay ${currentItem.product.stock} unidades disponibles`,
      });
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: newQuantity,
              subtotal: newQuantity * Number(item.product.price),
            }
          : item,
      ),
    );
  };

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

      setCart((currentCart) => [...currentCart, newItem]);
      toast.success("Producto agregado", {
        description: `${product.name} agregado a la venta`,
      });
    }

    setSearchTerm("");
  };

  const completeSale = () => {
    if (notifyCaiBlocked()) {
      return;
    }

    if (cart.length === 0) {
      toast.error("Venta vacia", {
        description: "Debe agregar al menos un producto a la venta",
      });
      return;
    }

    if (hasCartStockIssues(cart)) {
      toast.error("Error de stock", {
        description:
          "Algunos productos tienen cantidades que exceden el stock disponible",
      });
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmSale = async () => {
    if (!user) return;
    if (notifyCaiBlocked()) return;

    const saleRequest = {
      usuarioId: user.id,
      sucursalId: user.sucursal.id,
      productos: cart.map((item) => ({
        productoId: item.product.id,
        cantidad: item.quantity,
      })),
    };

    createVentaMutation.mutate(saleRequest, {
      onSuccess: async (response: SaleResponse) => {
        if (!response.success) return;

        const sale: Sale = {
          id: response.data.id,
          saleNumber: Number(response.data.id),
          date: response.data.createdAt || new Date().toISOString(),
          cashier: user.nombreCompleto || "Usuario",
          items: cart,
          subtotal: totals.subtotal,
          total: Number(response.data.total),
        };

        // Generar factura automáticamente
        try {
          const facturaResponse = await createFacturaMutation.mutateAsync({
            usuarioId: user.id,
            sucursalId: user.sucursal.id,
            ventaId: response.data.id,
          });

          if (facturaResponse.success) {
            sale.factura = facturaResponse.data;
          }
        } catch {
          // Si falla la factura, aún mostramos la venta completada
          toast.warning("Venta registrada, pero no se pudo generar la factura");
        }

        setCompletedSale(sale);
        setShowConfirmModal(false);
        setCart([]);
        setSearchTerm("");
      },
    });
  };

  const cancelSale = () => {
    if (cart.length === 0) return;

    if (window.confirm("Esta seguro que desea cancelar esta venta?")) {
      setCart([]);
      setSearchTerm("");
      toast.info("Venta cancelada");
    }
  };

  return {
    cart,
    completedSale,
    confirmSale,
    searchResults,
    searchTerm,
    setCompletedSale,
    setSearchTerm,
    showConfirmModal,
    setShowConfirmModal,
    totals,
    user,
    permisos,
    addToCart,
    cancelSale,
    completeSale,
    updateQuantity,
    removeFromCart,
  };
};

