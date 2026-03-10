import type { PermisosXCategoria } from "../../interfaces/PermisosInterface/categoriaPermisos";

interface CardEligirRolesProps extends PermisosXCategoria {
  permisosSeleccionados: Set<string>;
  onTogglePermiso: (id: string) => void;
  onToggleTodos: (ids: string[]) => void;
}

export default function CardEligirRoles({
  permisosSeleccionados,
  onTogglePermiso,
  onToggleTodos,
  ...grupo
}: Readonly<CardEligirRolesProps>) {
  const todosSeleccionados = grupo.permisos.every((p) =>
    permisosSeleccionados.has(p.id),
  );

  return (
    <div className="overflow-hidden rounded-xl border border-[#9adce2] bg-white ">
      {/* Header del grupo */}
      <div className="flex items-center justify-between bg-[#9adce2] px-5 py-3">
        <span className="text-lg font-bold text-[#0a4d76]">
          {grupo.nombreCategoria}
        </span>
        <button
          type="button"
          className="cursor-pointer text-sm font-semibold text-[#0aa6a2] hover:text-[#06706d]"
          onClick={() => onToggleTodos(grupo.permisos.map((p) => p.id))}
        >
          {todosSeleccionados ? "Deseleccionar todos" : "Seleccionar todos"}
        </button>
      </div>

      {/* Lista de permisos */}
      <div className="divide-y divide-[#f3f5f8]">
        {grupo.permisos.map((permiso) => {
          const isSelected = permisosSeleccionados.has(permiso.id);
          return (
            <div
              key={permiso.id}
              className="flex items-center justify-between px-5 py-4"
            >
              <div>
                <p className="text-base font-semibold text-[#0a4d76]">
                  {permiso.nombre}
                </p>
                <p className="text-sm text-[#6a758f]">
                  {permiso.descripcion}
                </p>
              </div>
              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => onTogglePermiso(permiso.id)}
                className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${isSelected ? "bg-[#0aa6a2]" : "bg-[#d1d5db]"}`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${isSelected ? "left-6" : "left-1"}`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
