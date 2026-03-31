import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Sucursal } from "../../../interfaces/SucursalInterface";
import { faPenToSquare, faPowerOff } from "@fortawesome/free-solid-svg-icons";

interface Props {
  sucursales: Sucursal[];
  toggleStatus: (id: string) => void;
  tienePermiso: (permiso: string) => boolean;
  goToForm: (sucursal: Sucursal) => void;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export default function TableSucursalesData({
  sucursales,
  toggleStatus,
  tienePermiso,
  goToForm,
  isLoading,
  isError,
  error,
}: Props) {
  if (isLoading) {
    return (
      <tr>
        <td colSpan={7} className="text-center py-12 text-[#6b7a8f]">
          Cargando sucursales...
        </td>
      </tr>
    );
  }

  if (isError) {
    return (
      <tr>
        <td colSpan={7} className="text-center py-12 text-[#c20000]">
          {error instanceof Error ? error.message : "Error cargando sucursales"}
        </td>
      </tr>
    );
  }

  if (sucursales.length === 0) {
    return (
      <tr>
        <td colSpan={7} className="text-center py-12 text-[#6b7a8f]">
          Sin Sucursales
        </td>
      </tr>
    );
  }

  return sucursales.map((s) => (
    <tr key={s.id} className="border-b border-[#9adce2] last:border-b-0">
      <td className="px-6 py-4 text-base font-semibold text-[#0a4d76] md:text-xl">
        {s.nombre}
        <div className="text-sm text-gray-500 italic">{s.direccion}</div>
      </td>
      <td className="px-4 py-4 text-sm text-[#4661b0] md:text-lg">
        {s.gerente}
      </td>
      <td className="px-4 py-4 text-center">
        <span
          className={`inline-flex rounded-full ${
            s.activa
              ? "bg-[#b7e4ca] text-[#008444]"
              : "bg-[#86817f] text-[#efeeee]"
          } px-4 py-1 text-sm font-semibold  md:text-base`}
        >
          {s.activa ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td className="px-4 py-4 text-center">
        <div className="flex items-center justify-center gap-4 text-lg md:text-xl">
          {tienePermiso("Editar sucursales") && (
            <button
              type="button"
              className={`cursor-pointer ${
                s.activa
                  ? "text-[#ff5e00] hover:text-[#b64402]"
                  : "text-[#24e775] hover:text-[#008444]"
              } `}
              aria-label={`Cambiar estado de ${s.nombre}`}
              onClick={() => toggleStatus(s.id)}
            >
              <FontAwesomeIcon icon={faPowerOff} />
            </button>
          )}
          {tienePermiso("Editar sucursales") && (
            <button
              type="button"
              onClick={() => goToForm(s)}
              className="cursor-pointer text-[#00a3b8] hover:text-[#007786]"
              aria-label={`Editar ${s.nombre}`}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          )}
        </div>
      </td>
    </tr>
  ));
}
