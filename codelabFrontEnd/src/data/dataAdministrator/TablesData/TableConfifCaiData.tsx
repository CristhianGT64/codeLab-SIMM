import type { ReactNode } from "react";
import type { Icai } from "../../../interfaces/CAI/Icai";
import EstadosObjetos from "../../../components/EstadosObjetos/EstadosObjetos";
import { estadoCaiValido, estadoCaiVencido } from "../ConfiguracionCAIData";

export const contenidoTablaCaiEmitidos = (
  isLoadingCaisEmitidos: boolean,
  caisPaginados: Icai[],
  onSelectCai: (idCai: string) => void,
  selectedCaiId?: string,
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
      className={`border-b border-gray-100 transition-colors cursor-pointer ${
        selectedCaiId === cai.id_cai
          ? "bg-[#dff4ff]"
          : i % 2 === 0
            ? "bg-white hover:bg-[#f0f6ff]"
            : "bg-gray-50/60 hover:bg-[#f0f6ff]"
      }`}
      onClick={() => onSelectCai(cai.id_cai)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelectCai(cai.id_cai);
        }
      }}
      aria-pressed={selectedCaiId === cai.id_cai}
    >
      {/* Numero CAI */}
      <td className="px-6 py-4 text-[#24364d] whitespace-nowrap">
        {cai.codigo}
      </td>

      {/* Rango */}
      <td className="px-6 py-4 font-medium text-[#0b4d77]">
        {cai.rangoFormateado ??
          `${cai.rangoEmision?.inicio_rango ?? "0"} - ${cai.rangoEmision?.final_rango ?? "0"}`}
      </td>

      {/* Vencimiento */}
      <td className="px-6 py-4">
        {new Date(cai.fechaFin).toLocaleDateString()}
      </td>

      {/* ultima Factura */}
      <td>
        {cai.ultimaFacturaEmitida?.numeroFormateado ?? "Sin emitir"}
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
