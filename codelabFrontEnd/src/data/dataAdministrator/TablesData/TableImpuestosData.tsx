import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import type { ImpuestoConfiguracion } from "../../../interfaces/Configuracion/ImpuestoInterface";

interface Props {
  impuestos: ImpuestoConfiguracion[];
  onEdit: (impuesto: ImpuestoConfiguracion) => void;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export default function TableImpuestosData({
  impuestos,
  onEdit,
  isLoading,
  isError,
  error,
}: Readonly<Props>) {
  if (isLoading) {
    return (
      <tr>
        <td colSpan={5} className="py-12 text-center text-[#6b7a8f]">
          Cargando impuestos...
        </td>
      </tr>
    );
  }

  if (isError) {
    return (
      <tr>
        <td colSpan={5} className="py-12 text-center text-[#c20000]">
          {error instanceof Error ? error.message : "Error cargando impuestos"}
        </td>
      </tr>
    );
  }

  if (impuestos.length === 0) {
    return (
      <tr>
        <td colSpan={5} className="py-12 text-center text-[#6b7a8f]">
          Sin impuestos configurados
        </td>
      </tr>
    );
  }

  return impuestos.map((impuesto) => (
    <tr
      key={impuesto.id}
      className="border-b border-[#9adce2] last:border-b-0"
    >
      <td className="px-4 py-4 text-sm font-semibold text-[#24364d] md:text-lg">
        {impuesto.nombre}
      </td>
      <td className="px-4 py-4 text-sm text-[#4661b0] md:text-lg">
        {impuesto.porcentaje.toFixed(2)}%
      </td>
      <td className="px-4 py-4 text-sm text-[#4661b0] md:text-lg">
        {impuesto.tasa.toFixed(4)}
      </td>
      <td className="px-4 py-4 text-center">
        <span
          className={`inline-flex rounded-full px-4 py-1 text-sm font-semibold md:text-base ${
            impuesto.activo
              ? "bg-[#b7e4ca] text-[#008444]"
              : "bg-[#86817f] text-[#efeeee]"
          }`}
        >
          {impuesto.activo ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td className="px-4 py-4 text-center">
        <button
          type="button"
          onClick={() => onEdit(impuesto)}
          className="cursor-pointer text-lg text-[#0aa6a2] hover:text-[#06706d] md:text-xl"
          aria-label={`Editar ${impuesto.nombre}`}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
      </td>
    </tr>
  ));
}
