import { faCheckCircle, faPrint, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Sale } from "../../interfaces/POS/IPos";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-HN", { style: "currency", currency: "HNL" }).format(value);

const formatFechaFactura = (iso: string) =>
  new Date(iso).toLocaleString("es-HN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatFechaLimite = (iso: string) =>
  new Date(iso).toLocaleDateString("es-HN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const VentaRegistrada = ({
  completedSale,
  setCompletedSale,
}: {
  completedSale: Sale;
  setCompletedSale: (sale: Sale | null) => void;
}) => {
  const factura = completedSale.factura;

  const handlePrint = () => {
    window.print();
  };

  // Si no hay factura, mostrar vista simple de respaldo
  if (!factura) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FontAwesomeIcon icon={faCheckCircle} className="text-5xl text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-[#114c6f] mb-2">¡Venta Registrada!</h2>
            <p className="text-lg text-[#4a6eb0] mb-6">
              Venta #{completedSale.saleNumber} completada exitosamente
            </p>
            <p className="text-sm text-amber-600 mb-6">No se pudo generar la factura para esta venta.</p>
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

  return (
    <div className="p-6 print:p-0">
      <div className="max-w-3xl mx-auto">
        {/* Factura formal */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden print:shadow-none print:rounded-none">
          {/* Header de la factura */}
          <div className="bg-linear-to-r from-[#079f9b] to-[#4a6eb0] p-6 text-white print:bg-white print:text-black print:border-b-2 print:border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold tracking-wide">FACTURA</h1>
                <p className="text-white/80 print:text-gray-600 text-sm mt-1">Documento Fiscal Autorizado por la SAR</p>
              </div>
              <div className="text-right">
                <div className="bg-white/20 print:bg-gray-100 rounded-lg px-4 py-2">
                  <p className="text-xs text-white/70 print:text-gray-500 uppercase tracking-wider">N° Factura</p>
                  <p className="text-lg font-bold font-mono">{factura.numeroFactura}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cuerpo de la factura */}
          <div className="p-6 space-y-5">
            {/* Datos de la empresa / sucursal */}
            <div className="bg-gradient-to-br from-[#f0fafa] to-[#eef2f9] rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#4a6eb0] uppercase tracking-wider font-semibold">Sucursal</p>
                  <p className="font-bold text-[#114c6f] text-lg">{factura.sucursal.nombre}</p>
                  <p className="text-sm text-[#4a6eb0]">{factura.sucursal.direccion}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#4a6eb0] uppercase tracking-wider font-semibold">Fecha de Emisión</p>
                  <p className="font-semibold text-[#114c6f]">{formatFechaFactura(factura.fechaEmision)}</p>
                </div>
              </div>
            </div>

            {/* Info del CAI y rango */}
            <div className="border border-[#9cd2d3] rounded-xl p-4 space-y-3">
              <div>
                <p className="text-xs text-[#4a6eb0] uppercase tracking-wider font-semibold">CAI</p>
                <p className="font-mono text-sm font-semibold text-[#114c6f] break-all">{factura.cai.codigo}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#4a6eb0] uppercase tracking-wider font-semibold">Rango Autorizado</p>
                  <p className="font-mono text-sm text-[#114c6f]">
                    {String(factura.rangoEmision.inicio).padStart(8, "0")} — {String(factura.rangoEmision.fin).padStart(8, "0")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#4a6eb0] uppercase tracking-wider font-semibold">Fecha Límite de Emisión</p>
                  <p className="text-sm font-semibold text-[#114c6f]">{formatFechaLimite(factura.cai.fechaLimite)}</p>
                </div>
              </div>
            </div>

            {/* Cliente y cajero */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-[#4a6eb0] uppercase tracking-wider font-semibold">Cliente</p>
                <p className="font-semibold text-[#114c6f]">
                  {factura.cliente?.nombre || "Consumidor Final"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-[#4a6eb0] uppercase tracking-wider font-semibold">Cajero</p>
                <p className="font-semibold text-[#114c6f]">{factura.usuario.nombre}</p>
              </div>
            </div>

            {/* Tabla de productos */}
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#114c6f] text-white">
                    <th className="text-left py-3 px-4 text-sm font-semibold">Producto</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Cant.</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold">P. Unitario</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {factura.detalles.map((detalle, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="py-3 px-4 text-sm text-[#114c6f] font-medium">{detalle.producto}</td>
                      <td className="py-3 px-4 text-sm text-center text-[#4a6eb0]">{detalle.cantidad}</td>
                      <td className="py-3 px-4 text-sm text-right text-[#4a6eb0]">{formatCurrency(detalle.precioUnitario)}</td>
                      <td className="py-3 px-4 text-sm text-right font-semibold text-[#114c6f]">{formatCurrency(detalle.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Desglose fiscal */}
            <div className="bg-gradient-to-br from-[#f0fafa] to-[#eef2f9] rounded-xl p-5">
              <h3 className="text-sm font-bold text-[#114c6f] uppercase tracking-wider mb-3">Desglose Fiscal</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#4a6eb0]">Importe Exento</span>
                  <span className="font-medium text-[#114c6f]">{formatCurrency(factura.totales.exento)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#4a6eb0]">Importe Gravado 15%</span>
                  <span className="font-medium text-[#114c6f]">{formatCurrency(factura.totales.gravado15)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#4a6eb0]">Importe Gravado 18%</span>
                  <span className="font-medium text-[#114c6f]">{formatCurrency(factura.totales.gravado18)}</span>
                </div>

                <div className="border-t border-[#9cd2d3] pt-2 mt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#4a6eb0]">ISV 15%</span>
                    <span className="font-semibold text-[#114c6f]">{formatCurrency(factura.totales.isv15)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#4a6eb0]">ISV 18%</span>
                    <span className="font-semibold text-[#114c6f]">{formatCurrency(factura.totales.isv18)}</span>
                  </div>
                </div>

                <div className="border-t-2 border-[#079f9b] pt-3 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-[#114c6f]">TOTAL</span>
                    <span className="text-2xl font-bold text-[#079f9b]">{formatCurrency(factura.totales.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pie de factura */}
            <div className="text-center text-xs text-[#4a6eb0] border-t border-gray-200 pt-4 space-y-1">
              <p>La factura es beneficio de todos. ¡Exígala!</p>
              <p>Original: Cliente — Copia: Obligado Tributario</p>
            </div>
          </div>

          {/* Botones de acción (no se imprimen) */}
          <div className="p-6 pt-0 flex gap-4 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 px-6 py-4 border-2 border-[#079f9b] text-[#079f9b] rounded-xl font-bold hover:bg-[#079f9b]/10 transition-all flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faPrint} />
              Imprimir Factura
            </button>
            <button
              onClick={() => setCompletedSale(null)}
              className="flex-1 px-6 py-4 bg-linear-to-r from-[#079f9b] to-[#4a6eb0] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              Nueva Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
