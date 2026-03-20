import type { User } from "../../../interfaces/Users/UserInterface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPowerOff,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

interface TableUsersDataProps {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  users: User[];
  inactiveUser: (id: string) => void;
  activeUser: (id: string) => void;
  deleteUserMutation: (id: string) => void;
  tienePermiso: (permiso: string) => boolean;
  navigate: (path: string) => void;
}

export default function TableUsersData({
  isLoading,
  isError,
  error,
  users,
  inactiveUser,
  activeUser,
  deleteUserMutation,
  tienePermiso,
  navigate,
}: TableUsersDataProps) {

  const roleStyles: Record<string, string> = {
    "Super Administrador": "bg-[#9dd8df] text-[#0a4d76]",
    Administrador: "bg-[#9dd8df] text-[#0a4d76]",
    Cajero: "bg-[#9dd8df] text-[#0a4d76]",
    Bodeguero: "bg-[#9dd8df] text-[#0a4d76]",
  };
  if (isLoading) {
    return (
      <tr>
        <td colSpan={7} className="text-center py-12 text-[#6b7a8f]">
          Cargando Usuarios...
        </td>
      </tr>
    );
  }

  if (isError) {
    return (
      <tr>
        <td colSpan={7} className="text-center py-12 text-[#c20000]">
          {error instanceof Error ? error.message : "Error cargando usuarios"}
        </td>
      </tr>
    );
  }

  if (users.length === 0) {
    return (
      <tr>
        <td colSpan={7} className="text-center py-12 text-[#6b7a8f]">
          Sin Usuarios
        </td>
      </tr>
    );
  }

  return users.map((user) => (
    /* Comienzo de tabla */

    <tr key={user.id} className="border-b border-[#9adce2] last:border-b-0">
      <td className="px-6 py-4 text-base font-semibold text-[#0a4d76] md:text-xl">
        {user.nombreCompleto}
      </td>
      <td className="px-4 py-4 text-sm text-[#4661b0] md:text-lg">
        {user.usuario}
      </td>
      <td className="px-4 py-4 text-sm text-[#4661b0] md:text-lg">
        {user.correo}
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex rounded-full px-4 py-1 text-sm font-semibold md:text-base ${roleStyles[user.rol.nombre] ?? "bg-[#9dd8df] text-[#0a4d76]"}`}
        >
          {user.rol.nombre}
        </span>
      </td>
      <td className="px-4 py-4 text-sm text-[#4661b0] md:text-lg">
        {user.sucursal.nombre}
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex rounded-full ${user.estado === "activo" ? "bg-[#b7e4ca] text-[#008444]" : "bg-[#86817f] text-[#efeeee]"} px-4 py-1 text-sm font-semibold  md:text-base`}
        >
          {user.estado === "activo" ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-4 text-lg md:text-xl">
          {tienePermiso("Editar usuarios") && (
            <button
              type="button"
              className={`cursor-pointer ${user.estado === "activo" ? "text-[#ff5e00] hover:text-[#b64402]" : "text-[#24e775] hover:text-[#008444]"} `}
              aria-label={`Cambiar estado de ${user.nombreCompleto}`}
              onClick={
                user.estado === "activo"
                  ? () => inactiveUser(user.id)
                  : () => activeUser(user.id)
              }
            >
              <FontAwesomeIcon icon={faPowerOff} />
            </button>
          )}
          {tienePermiso("Editar usuarios") && (
            <button
              type="button"
              onClick={() =>
                navigate(`/Users-Management/Update-User/${user.id}`)
              }
              className="cursor-pointer text-[#00a3b8] hover:text-[#007786]"
              aria-label={`Editar ${user.nombreCompleto}`}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          )}
          {tienePermiso("Eliminar usuarios") && (
            <button
              type="button"
              onClick={() => deleteUserMutation(user.id)}
              className="cursor-pointer text-[#ff0000] hover:text-[#7d0202] "
              aria-label={`Eliminar ${user.nombreCompleto}`}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          )}
        </div>
      </td>
    </tr>

    /* Final de tabla */
  ));
};
