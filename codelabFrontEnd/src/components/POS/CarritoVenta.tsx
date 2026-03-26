import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { CartItem } from "../../interfaces/POS/IPos";
import {
  faExclamationTriangle,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import ButtonsComponet from "../buttonsComponents/ButtonsComponet";
import { botonEliminarCarrito, botonMasCarrito, botonMenosCarrito } from "../../data/dataAdministrator/CarritoVentaData";

export default function CarritoVenta({
  cart,
  removeFromCart,
  updateQuantity,
}: {
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {cart.length === 0 ? (
        <div className="text-center py-12 text-[#4a6eb0]">
          <FontAwesomeIcon
            icon={faShoppingCart}
            className="text-6xl mx-auto mb-4 opacity-50"
          />
          <p>No hay productos en la venta</p>
          <p className="text-sm mt-2">Busca y agrega productos para comenzar</p>
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
                    {new Intl.NumberFormat("es-HN", {
                      style: "currency",
                      currency: "HNL",
                    }).format(item.product.price)}{" "}
                    c/u
                  </div>
                  <div className="text-xs text-[#4a6eb0] mt-1">
                    {item.product.taxName}: {(item.product.taxRate * 100).toFixed(0)}%
                  </div>
                </div>
                <ButtonsComponet
                    {...botonEliminarCarrito}
                    onClick={() => removeFromCart(item.product.id)}
                />
              </div>

              {item.quantity > item.product.stock && (
                <div className="bg-red-100 border border-red-400 rounded p-2 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="text-red-600 flex-shrink-0"
                  />
                  <span className="text-xs text-red-800">
                    Stock insuficiente (disponible: {item.product.stock})
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <ButtonsComponet
                        {...botonMenosCarrito}
                        onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                        }
                    />
                  <span className="w-8 text-center font-semibold text-[#114c6f]">
                    {item.quantity}
                  </span>
                  <ButtonsComponet
                    {...botonMasCarrito}
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                  />
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#079f9b]">
                    {new Intl.NumberFormat("es-HN", {
                      style: "currency",
                      currency: "HNL",
                    }).format(item.subtotal + item.subtotal * item.product.taxRate)}
                  </div>
                  <div className="text-xs text-[#4a6eb0]">
                    Base:{" "}
                    {new Intl.NumberFormat("es-HN", {
                      style: "currency",
                      currency: "HNL",
                    }).format(item.subtotal)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
