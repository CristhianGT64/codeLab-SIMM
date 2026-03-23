import type { CartItem } from "../../interfaces/POS/IPos";
import ButtonsComponet from "../buttonsComponents/ButtonsComponet";
import { botonFinalizarVenta } from "../../data/dataAdministrator/POSData";

export default function TotalSubTotalVenta({
  cart,
  totals,
  completeSale,
  permisos
}: {
  cart: CartItem[];
  totals: { subtotal: number; total: number };
  completeSale: () => void;
  permisos: string[];
}) {
  return (
    <div className="p-4 border-t-2 border-gray-200">
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-[#4a6eb0]">Subtotal:</span>
          <span className="text-lg font-semibold text-[#114c6f]">
            {new Intl.NumberFormat("es-HN", {
              style: "currency",
              currency: "HNL",
            }).format(totals.subtotal)}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t-2 border-gray-300">
          <span className="text-xl font-bold text-[#114c6f]">Total:</span>
          <span className="text-2xl font-bold text-[#079f9b]">
            {new Intl.NumberFormat("es-HN", {
              style: "currency",
              currency: "HNL",
            }).format(totals.total)}
          </span>
        </div>
      </div>

      {permisos.includes("Finalizar Venta") && (
        <ButtonsComponet
          {...botonFinalizarVenta}
          onClick={completeSale}
          disabled={cart.length === 0}
        className={`w-full px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
          cart.length === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-linear-to-r from-[#079f9b] to-[#4a6eb0] text-white hover:shadow-lg"
        }`}
      />
      )}
    </div>
  );
}
