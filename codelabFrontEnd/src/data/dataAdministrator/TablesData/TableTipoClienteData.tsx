import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPowerOff, faEye } from "@fortawesome/free-solid-svg-icons";
import type { TipoCliente } from "../../../interfaces/TiposdeCliente/TipoClienteInterface";

interface Props {
  tiposCliente: TipoCliente[];
  onView: (tipoCliente: TipoCliente) => void;
  onEdit: (tipoCliente: TipoCliente) => void;
  onToggleStatus: (tipoCliente: TipoCliente) => void;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export default function TableTipoClienteData({
  tiposCliente,
  onView,
  onEdit,
  onToggleStatus,
  isLoading,
  isError,
  error,
}: Props) {
  if (isLoading) {
    return (
      <tr>
        <td colSpan={6} className="text-center py-12 text-[#6b7a8f]">
          Cargando tipos de cliente...
        </td>
      </tr>
    );
  }

  if (isError) {
    return (
      <tr>
        <td colSpan={6} className="text-center py-12 text-[#c20000]">
          {error instanceof Error
            ? error.message
            : "Error cargando tipos de cliente"}
        </td>
      </tr>
    );
  }

  if (tiposCliente.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="text-center py-12 text-[#6b7a8f]">
          Sin tipos de cliente
        </td>
      </tr>
    );
  }

  return tiposCliente.map((tc) => (
    <tr key={tc.id} className="border-b border-[#9adce2] last:border-b-0">
      <td className="px-4 py-4 text-sm text-[#24364d] md:text-lg font-semibold">
        {tc.nombre}
      </td>
      <td className="px-4 py-4 text-sm text-[#4661b0] md:text-lg">
        {tc.condicionPago ?? "—"}
      </td>
      <td className="px-4 py-4 text-sm text-[#4661b0] md:text-lg">
        {tc.diasCredito > 0 ? `${tc.diasCredito} días` : "—"}
      </td>
      <td className="px-4 py-4 text-center text-sm text-[#0a4d76] md:text-lg font-semibold">
        {tc._count?.clientes ?? 0}
      </td>
      <td className="px-4 py-4 text-center">
        <span
          className={`inline-flex rounded-full ${
            tc.disponible
              ? "bg-[#b7e4ca] text-[#008444]"
              : "bg-[#86817f] text-[#efeeee]"
          } px-4 py-1 text-sm font-semibold md:text-base`}
        >
          {tc.disponible ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td className="px-4 py-4 text-center">
        <div className="flex items-center justify-center gap-4 text-lg md:text-xl">
          <button
            type="button"
            onClick={() => onView(tc)}
            className="cursor-pointer text-[#4661b0] hover:text-[#2c3d70]"
            aria-label={`Ver detalle de ${tc.nombre}`}
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            type="button"
            onClick={() => onEdit(tc)}
            className="cursor-pointer text-[#0aa6a2] hover:text-[#06706d]"
            aria-label={`Editar ${tc.nombre}`}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus(tc)}
            className={`cursor-pointer ${
              tc.disponible
                ? "text-[#ff5e00] hover:text-[#b64402]"
                : "text-[#24e775] hover:text-[#008444]"
            }`}
            aria-label={`Cambiar estado de ${tc.nombre}`}
          >
            <FontAwesomeIcon icon={faPowerOff} />
          </button>
        </div>
      </td>
    </tr>
  ));
}
