import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import type { Client } from "../../../interfaces/Clients/ClientInterface";

interface Props {
  clientes: Client[];
  tienePermiso: (permiso: string) => boolean;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  navigate: (path: string) => void;
}

export default function TableClientData({
  clientes,
  tienePermiso,
  isLoading,
  isError,
  error,
  navigate,
}: Props) {
  const typeStyles: Record<string, string> = {
    Contado: "bg-[#d1eaf8] text-[#0f6d8c]",
    Crédito: "bg-[#f8d7da] text-[#721c24]",
    Mayorista: "bg-[#fff3cd] text-[#856404]",
    Minorista: "bg-[#d4edda] text-[#155724]",
  };

  if (isLoading) {
    return (
      <tr>
        <td colSpan={7} className="text-center py-12 text-[#6b7a8f]">
          Cargando clientes...
        </td>
      </tr>
    );
  }

  if (isError) {
    return (
      <tr>
        <td colSpan={7} className="text-center py-12 text-[#c20000]">
          {error instanceof Error ? error.message : "Error cargando clientes"}
        </td>
      </tr>
    );
  }

  if (clientes.length === 0) {
    return (
      <tr>
        <td colSpan={7} className="text-center py-12 text-[#6b7a8f]">
          Sin Clientes
        </td>
      </tr>
    );
  }

  return clientes.map((client) => (
    <tr
      key={client.id}
      className="border-b border-[#9adce2] last:border-b-0 hover:bg-[#f8fbff]"
    >
      <td className="px-6 py-4 text-base font-semibold text-[#0a4d76] md:text-xl">
        {client.nombreCompleto}
        <div className="text-sm text-gray-500">{client.correo || "—"}</div>
      </td>
      <td className="px-4 py-4 text-sm text-[#4661b0]">
        {client.identificacion}
      </td>
      <td className="px-4 py-4 text-sm text-[#4661b0]">
        {client.telefono || "—"}
      </td>
      <td className="px-4 py-4 text-sm">
        <div className="mt-1 flex items-center justify-center">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${typeStyles[client.tipoCliente] ?? "bg-[#d1eaf8] text-[#0f6d8c]"}`}
          >
            {client.tipoCliente || "Contado"}
          </span>
        </div>
      </td>
      <td className="px-4 py-4 text-center">
        <div className="flex items-center justify-center gap-3 text-[#1f3f6d]">
          {tienePermiso("Editar clientes") && (
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-[#0fa8ad] hover:bg-[#e6fdfd]"
              onClick={() =>
                navigate(`/Clients-Management/Update-Client/${client.id}`)
              }
              aria-label="Editar cliente"
            >
              <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
            </button>
          )}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-[#2f69c2] hover:bg-[#eff4ff]"
            onClick={() =>
              navigate(`/Clients-Management/Detail-Client/${client.id}`)
            }
            aria-label="Ver historial de cliente"
          >
            <FontAwesomeIcon icon={faClock} className="text-lg" />
          </button>
        </div>
      </td>
    </tr>
  ));
}
