import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { CartItem, CartTotals } from "../../interfaces/POS/IPos";
import { faCheckCircle, faUser } from "@fortawesome/free-solid-svg-icons";

export default function ConfirmarVentas({
  cart,
  totals,
  confirmSale,
  setShowConfirmModal,
  user,
}: {
  cart: CartItem[];
  totals: CartTotals;
  confirmSale: () => void;
  setShowConfirmModal: (show: boolean) => void;
  user: { nombreCompleto: string } | null;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        <div className="bg-linear-to-r from-[#079f9b] to-[#4a6eb0] p-6 text-center">
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
                  {user?.nombreCompleto || "Usuario"}
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
                  <div className="text-[#114c6f]">
                    <div>
                      {item.product.name} x {item.quantity}
                    </div>
                    <div className="text-xs text-[#4a6eb0]">
                      {item.product.taxName}: {(item.product.taxRate * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-[#079f9b]">
                      {new Intl.NumberFormat("es-HN", {
                        style: "currency",
                        currency: "HNL",
                      }).format(item.subtotal)}
                    </div>
                    <div className="text-xs text-[#4a6eb0]">
                      +
                      {" "}
                      {new Intl.NumberFormat("es-HN", {
                        style: "currency",
                        currency: "HNL",
                      }).format(item.subtotal * item.product.taxRate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#4a6eb0]">Subtotal:</span>
                <span className="font-semibold text-[#114c6f]">
                  {new Intl.NumberFormat("es-HN", {
                    style: "currency",
                    currency: "HNL",
                  }).format(totals.subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#4a6eb0]">Impuesto:</span>
                <span className="font-semibold text-[#114c6f]">
                  {new Intl.NumberFormat("es-HN", {
                    style: "currency",
                    currency: "HNL",
                  }).format(totals.tax)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-[#114c6f]">
                  Total a Pagar:
                </span>
                <span className="text-2xl font-bold text-[#079f9b]">
                  {new Intl.NumberFormat("es-HN", {
                    style: "currency",
                    currency: "HNL",
                  }).format(totals.total)}
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
              className="flex-1 px-6 py-3 bg-linear-to-r from-[#079f9b] to-[#4a6eb0] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Confirmar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
