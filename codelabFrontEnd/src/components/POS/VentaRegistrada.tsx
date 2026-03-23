import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Sale } from "../../interfaces/POS/IPos";

export const VentaRegistrada = ({completedSale, setCompletedSale} : {completedSale : Sale, setCompletedSale : (sale : Sale | null) => void}) => {

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
                    {new Intl.NumberFormat('es-HN').format(completedSale.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-[#114c6f]">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-[#079f9b]">
                    {new Intl.NumberFormat('es-HN').format(completedSale.total)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCompletedSale(null)}
              className="w-full px-6 py-4 bg-linear-to-r from-[#079f9b] to-[#4a6eb0] text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Nueva Venta
            </button>
          </div>
        </div>
      </div>
    );
    

}
