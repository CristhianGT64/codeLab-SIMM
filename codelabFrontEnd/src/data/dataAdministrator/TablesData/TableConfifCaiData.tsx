import type { ReactNode } from "react";
import type { Icai } from "../../../interfaces/CAI/Icai";
import EstadosObjetos from "../../../components/EstadosObjetos/EstadosObjetos";
import { estadoCaiValido, estadoCaiVencido } from "../ConfiguracionCAIData";

export const contenidoTablaCaiEmitidos = (
  isLoadingCaisEmitidos: boolean,
  caisPaginados: Icai[],
): ReactNode => {
  if (isLoadingCaisEmitidos) {
    return (
      <tr>
        <td colSpan={7} className="text-center py-12 text-[#6b7a8f]">
          Cargando CAI Emitidos…
        </td>
      </tr>
    );
  }

  if (caisPaginados.length === 0) {
    return (
      <tr>
        <td colSpan={7} className="text-center py-12 text-[#6b7a8f]">
          Sin CAI Emitidos
        </td>
      </tr>
    );
  }

  return caisPaginados.map((cai, i) => (
    <tr
      key={cai.id_cai}
      className={`border-b border-gray-100 hover:bg-[#f0f6ff] transition-colors ${
        i % 2 === 0 ? "bg-white" : "bg-gray-50/60"
      }`}
    >
      {/* Numero CAI */}
      <td className="px-6 py-4 text-[#24364d] whitespace-nowrap">
        {cai.codigo}
      </td>

      {/* Rango */}
      <td className="px-6 py-4 font-medium text-[#0b4d77]">
        {cai.rangoEmision?.inicio_rango} - {cai.rangoEmision?.final_rango}
      </td>

      {/* Vencimiento */}
      <td className="px-6 py-4">
        {new Date(cai.fechaFin).toLocaleDateString()}
      </td>

      {/* ultima Factura */}
      <td>
        {Number(cai.cantidadFacturasEmitidas - 1) +
          Number(cai.rangoEmision?.inicio_rango)}
      </td>

      {/* Estado */}
      <td className="px-6 py-4 text-[#4661b0]">
        {isNaN(new Date(cai.fechaFin).getTime()) ||
        Number(
          (cai.cantidadFacturasEmitidas +
            Number(cai.rangoEmision?.inicio_rango) -
            1) /
            Number(cai.rangoEmision.final_rango),
        ) *
          100 >=
          100 ? (
          <EstadosObjetos {...estadoCaiVencido} />
        ) : (
          <EstadosObjetos {...estadoCaiValido} />
        )}
      </td>
    </tr>
  ));
};
