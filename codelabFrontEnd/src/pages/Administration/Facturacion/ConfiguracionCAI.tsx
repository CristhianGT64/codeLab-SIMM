import { useMemo } from "react";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import {
  alertaCaiPorAgotar,
  alertaCaiRangoAgotado,
  alertaCaiVencido,
  estadoCaiProxVencer,
  estadoCaiRangoAgotado,
  estadoCaiValido,
  estadoCaiVencido,
  titleConfiguracionCAI,
} from "../../../data/dataAdministrator/ConfiguracionCAIData";
import useReadCaiVigente from "../../../hooks/CaiHooks/useReadCaiVigente";
import { caiEmpty, type Icai } from "../../../interfaces/CAI/Icai";
import EstadosObjetos from "../../../components/EstadosObjetos/EstadosObjetos";
import {
  emptyEstado,
  type IestadosObjetos,
} from "../../../interfaces/IestadosObjetos";
import AlertaComponent from "../../../components/Alertas/AlertaComponent";

export default function ConfiguracionCAI() {
  const { data: CaiVigenteData, isLoading: isLoadingCaiVigente } =
    useReadCaiVigente();
  const caiVigente: Icai = CaiVigenteData?.data ?? caiEmpty;
  const fechaInicio = new Date(caiVigente.fechaInicio);
  const fechaFin = new Date(caiVigente.fechaFin);
  let estadoCaiVigente: IestadosObjetos = emptyEstado;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const { porcentajeEmitido, diasRestantes, facturasRestantes } =
    useMemo(() => {
      const finalRango = Number(caiVigente.rangoEmision?.final_rango || 0);
      const facturasEmitidas = Number(caiVigente.cantidadFacturasEmitidas || 0);

      const porcentaje = finalRango > 0 ? facturasEmitidas / finalRango : 0;
      const restantes = Math.max(0, finalRango - facturasEmitidas);

      const diffTime = fechaFin.getTime() - hoy.getTime();
      const dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        porcentajeEmitido: porcentaje.toFixed(3),
        diasRestantes: dias,
        facturasRestantes: restantes,
      };
    }, [caiVigente, fechaFin, hoy, fechaInicio]);

  /* Validar mensaje actual */

  if (hoy > fechaFin || isNaN(fechaFin.getTime())) {
    estadoCaiVigente = estadoCaiVencido;
  } else if (
    Number(porcentajeEmitido) * 100 < 80 &&
    Number(porcentajeEmitido) * 100 > 0
  ) {
    estadoCaiVigente = estadoCaiValido;
  } else if (
    Number(porcentajeEmitido) * 100 >= 80 &&
    Number(porcentajeEmitido) * 100 < 100
  ) {
    estadoCaiVigente = estadoCaiProxVencer;
  } else if (Number(porcentajeEmitido) * 100 >= 100) {
    estadoCaiVigente = estadoCaiRangoAgotado;
  }

  return (
    <section className="px-6 py-8 min-h-screen">
      <div className="flex justify-between">
        <HeaderTitleAdmin {...titleConfiguracionCAI} />
      </div>

      {/* Título */}

      {isLoadingCaiVigente ? (
        <div className="flex justify-center items-center mb-5 p-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1498b2]"></div>
          <h1 className="mt-1 text-lg font-bold text-[#0b4d77] md:text-xl ml-7">
            Cargando cai Vigente
          </h1>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 mb-8 mt-6 border-white hover:border-t-[#1498b2] border-6 rounded-2xl bg-[#f3f5f8] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
          {" "}
          {/* Comienzo de cai Vigente */}
          <div className="flex justify-between items-center mb-4">
            {" "}
            {/* Final de la primera fila */}
            <h2 className="mt-1 text-lg font-bold text-[#0b4d77] md:text-xl">
              CAI Vigente Activo
            </h2>
            {/* Mensaje de estado */}
            <EstadosObjetos {...estadoCaiVigente} />
            {/* Mensaje final de estado de cai */}
          </div>
          {/* Primera fila */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            {" "}
            {/* Informacion general del CAI */}
            <div>
              <h3 className="text-[#4661b0] md:text-xl mb-2">Número de CAI</h3>
              <div className="bg-[#F4F6F8] rounded px-2 py-1 text-lg font-mono text-[#0b4d77] mt-1">
                {caiVigente.codigo}
              </div>
            </div>
            <div>
              <h3 className="text-[#4661b0] md:text-xl mb-2">
                Rango Autorizado
              </h3>
              <div className="text-lg font-semibold text-[#0b4d77] mt-1">
                {`${Number(caiVigente.rangoEmision?.inicio_rango || 0).toLocaleString("en-US")} - ${Number(caiVigente.rangoEmision?.final_rango || 0).toLocaleString("en-US")}`}
              </div>
            </div>
            <div>
              <h3 className="text-[#4661b0] md:text-xl mb-2">
                Fecha de Vencimiento
              </h3>
              <div className="text-s font-semibold text-[#0b4d77] mt-1">
                {fechaFin.getDay()}/{fechaFin.getMonth()}/
                {fechaFin.getFullYear()}
              </div>
              <div className="text-s text-[#9A9A9A]">
                {diasRestantes} días restantes
              </div>
            </div>
            <div>
              <h3 className="text-[#4661b0] md:text-xl mb-2">
                Ultima Facura Emitida
              </h3>
              <div className="text-s font-semibold text-[#0b4d77] mt-1">
                N° de factura: {caiVigente.cantidadFacturasEmitidas}
              </div>
            </div>
          </div>
          {/* Final informacion general del cai */}
          {/* Barra de uso de rango */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-[#4A4E69] mb-1">
              <span className="text-lg text-[#4661b0] font-semibold">
                Inicial: {caiVigente.rangoEmision?.inicio_rango || "0"}
              </span>
              <span className="text-lg text-[#4661b0] font-semibold">
                Final: {caiVigente.rangoEmision?.final_rango || "0"}
              </span>
            </div>
            <div className="relative h-3 bg-[#F4F6F8] rounded">
              <div
                className="absolute left-0 top-0 h-3 rounded"
                style={{
                  width: `${Number(porcentajeEmitido) * 100}% `,
                  backgroundColor: `${Number(porcentajeEmitido) * 100 >= 80 && Number(porcentajeEmitido) * 100 < 100 ? "#FF9900" : Number(porcentajeEmitido) * 100 >= 100 ? "#ec1919" : "#168e48"}`,
                }}
              ></div>
            </div>
            <div className="flex justify-end text-lg text-[#4661b0] font-semibold mt-4">
              {facturasRestantes} facturas disponibles
            </div>
          </div>
          {/* Final de barra de uso de rango */}
          {/* Alerta */}
          {Number(porcentajeEmitido) * 100 >= 80 &&
            Number(porcentajeEmitido) * 100 < 100 && (
              <AlertaComponent {...alertaCaiPorAgotar} />
            )}
          {Number(porcentajeEmitido) * 100 >= 100 && (
            <AlertaComponent {...alertaCaiRangoAgotado} />
          )}
          {isNaN(fechaFin.getTime()) && (
            <AlertaComponent {...alertaCaiVencido} />
          )}
          {/* Final de alerta */}
        </div>
      )}

      {/* Historial de CAIs */}
      <div className="bg-white rounded-lg shadow mb-8 rounded-2xl bg-[#f3f5f8] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
        <h2 className="text-lg font-semibold text-[#22223B] mb-4">
          Historial de CAIs
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#F4F6F8] text-[#4A4E69]">
                <th className="px-4 py-2 text-left">Número de CAI</th>
                <th className="px-4 py-2 text-left">Rango</th>
                <th className="px-4 py-2 text-left">Vencimiento</th>
                <th className="px-4 py-2 text-left">Última Factura</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-[#22223B]">
                  F8A3E2-4D5C6B-7E8F9A-0B1C2D-3E4F5A-6B
                </td>
                <td className="px-4 py-2">1,000,000 - 1,005,000</td>
                <td className="px-4 py-2">30 de diciembre de 2024</td>
                <td className="px-4 py-2 text-[#2B7A78]">1,004,800</td>
                <td className="px-4 py-2">
                  <span className="bg-[#FFF4E5] text-[#FF9900] px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3"
                      />
                    </svg>
                    Próximo a vencer
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button className="border border-[#2B7A78] text-[#2B7A78] px-2 py-1 rounded hover:bg-[#E6F0F8] transition">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Registrar Nuevo CAI */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-[#22223B] mb-4">
          Registrar Nuevo CAI
        </h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#22223B] mb-1">
              Número de CAI <span className="text-[#FF4B4B]">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-[#E6E6E6] rounded px-3 py-2 text-sm font-mono focus:border-[#2B7A78] focus:outline-none"
              placeholder="F8A3E2-4D5C6B-7E8F9A-0B1C2D-3E4F5A-6B"
            />
            <span className="text-xs text-[#4A4E69] mt-1 block">
              Ingrese el número de CAI autorizado por la DEI
            </span>
          </div>
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-[#22223B] mb-1">
                Rango Inicial <span className="text-[#FF4B4B]">*</span>
              </label>
              <input
                type="number"
                className="w-full border border-[#E6E6E6] rounded px-3 py-2 text-sm focus:border-[#2B7A78] focus:outline-none"
                placeholder="1000000"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-[#22223B] mb-1">
                Rango Final <span className="text-[#FF4B4B]">*</span>
              </label>
              <input
                type="number"
                className="w-full border border-[#E6E6E6] rounded px-3 py-2 text-sm focus:border-[#2B7A78] focus:outline-none"
                placeholder="1005000"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#22223B] mb-1">
              Fecha de Vencimiento <span className="text-[#FF4B4B]">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-[#E6E6E6] rounded px-3 py-2 text-sm focus:border-[#2B7A78] focus:outline-none"
              placeholder="dd/mm/aaaa"
            />
          </div>
          <div className="bg-[#E6F0F8] rounded p-3 mb-4 text-xs text-[#2B7A78]">
            <span className="font-semibold">Importante:</span> Verifique que
            todos los datos coincidan exactamente con la autorización emitida
            por la DEI (Dirección Ejecutiva de Ingresos).
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              className="border border-[#E6E6E6] text-[#22223B] px-6 py-2 rounded font-medium hover:bg-[#F4F6F8] transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#2B7A78] to-[#3A86FF] text-white px-6 py-2 rounded font-medium hover:opacity-90 transition flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Guardar CAI
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
