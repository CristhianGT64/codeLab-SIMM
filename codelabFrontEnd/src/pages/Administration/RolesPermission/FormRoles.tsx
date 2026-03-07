import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";

const mockPermisos = [
  {
    categoria: "Usuarios",
    permisos: [
      { id: 1, nombre: "Ver usuarios", descripcion: "Permite visualizar el listado de usuarios" },
      { id: 2, nombre: "Crear usuarios", descripcion: "Permite crear nuevos usuarios" },
      { id: 3, nombre: "Editar usuarios", descripcion: "Permite modificar datos de usuarios" },
      { id: 4, nombre: "Eliminar usuarios", descripcion: "Permite eliminar usuarios del sistema" },
      { id: 5, nombre: "Activar/Desactivar usuarios", descripcion: "Permite cambiar el estado de usuarios" },
    ],
  },
  {
    categoria: "Productos",
    permisos: [
      { id: 6, nombre: "Ver productos", descripcion: "Permite visualizar el catálogo de productos" },
      { id: 7, nombre: "Crear productos", descripcion: "Permite agregar nuevos productos" },
      { id: 8, nombre: "Editar productos", descripcion: "Permite modificar información de productos" },
      { id: 9, nombre: "Eliminar productos", descripcion: "Permite eliminar productos del sistema" },
    ],
  },
  {
    categoria: "Sucursales",
    permisos: [
      { id: 10, nombre: "Ver sucursales", descripcion: "Permite visualizar las sucursales" },
      { id: 11, nombre: "Gestionar sucursales", descripcion: "Permite crear y editar sucursales" },
    ],
  },
];

export default function FormRoles() {
  return (
    <section className="w-full px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-220">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-2 text-base font-semibold text-[#0aa6a2] hover:text-[#06706d]"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
          <span className="text-[32px] leading-none">Volver al listado</span>
        </button>

        <header className="mt-6">
          <h2 className="text-4xl font-bold text-[#0a4d76]">Nuevo Rol</h2>
          <p className="mt-2 text-2xl text-[#4661b0]">
            Completa el formulario para crear un nuevo rol
          </p>
        </header>

        <form className="mt-8 rounded-2xl bg-[#f4f6f8] p-6 shadow-[0_6px_16px_rgba(0,0,0,0.1)] md:p-8">
          {/* Nombre del Rol */}
          <div>
            <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
              Nombre del Rol <span className="text-[#ff4f4f]">*</span>
            </p>
            <input
              id="nombreRol"
              type="text"
              placeholder="Ej: Editor de Contenido"
              className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
            />
          </div>

          {/* Descripción */}
          <div className="mt-6">
            <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
              Descripción <span className="text-[#ff4f4f]">*</span>
            </p>
            <textarea
              id="descripcion"
              rows={3}
              placeholder="Describe las funciones y alcance de este rol"
              className="w-full resize-none rounded-2xl border-2 border-[#9adce2] bg-white px-5 py-4 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
            />
          </div>

          {/* Permisos Asignados */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-semibold text-[#0a4d76]">
                  Permisos Asignados <span className="text-[#ff4f4f]">*</span>
                </p>
                <p className="text-base text-[#6a758f]">
                  Selecciona los permisos que tendrá este rol
                </p>
              </div>
              <span className="text-base font-semibold text-[#0aa6a2]">
                0 de 14 seleccionados
              </span>
            </div>

            {/* Grupos de permisos */}
            <div className="mt-4 space-y-4">
              {mockPermisos.map((grupo) => (
                <div
                  key={grupo.categoria}
                  className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white"
                >
                  {/* Header del grupo */}
                  <div className="flex items-center justify-between bg-[#f3f5f8] px-5 py-3">
                    <span className="text-lg font-bold text-[#0a4d76]">
                      {grupo.categoria}
                    </span>
                    <button
                      type="button"
                      className="cursor-pointer text-sm font-semibold text-[#0aa6a2] hover:text-[#06706d]"
                    >
                      Seleccionar todos
                    </button>
                  </div>

                  {/* Lista de permisos */}
                  <div className="divide-y divide-[#f3f5f8]">
                    {grupo.permisos.map((permiso) => (
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
                          className="relative h-6 w-11 cursor-pointer rounded-full bg-[#d1d5db] transition-colors"
                        >
                          <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Información importante */}
          <div className="mt-6 rounded-xl border-l-4 border-[#0aa6a2] bg-[#e8f3f5] p-5">
            <h3 className="text-3xl font-bold text-[#0a4d76]">
              Información importante
            </h3>
            <ul className="mt-3 list-disc space-y-1 pl-6 text-xl text-[#4661b0]">
              <li>El nombre del rol debe ser único en el sistema</li>
              <li>
                Los permisos se aplicarán inmediatamente al guardar los cambios
              </li>
              <li>
                Los cambios en permisos afectarán a todos los usuarios con este
                rol
              </li>
            </ul>
          </div>

          {/* Botones de acción */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <ButtonsComponet
              typeButton="button"
              onClick={() => {}}
              disabled={false}
              className="h-14 cursor-pointer rounded-2xl border-2 border-[#9adce2] bg-white text-2xl font-semibold text-[#4661b0] hover:bg-[#edf8fa]"
              text="Cancelar"
              icon="fa-solid fa-arrow-left"
            />

            <ButtonsComponet
              typeButton="submit"
              onClick={() => {}}
              disabled={false}
              className="inline-flex h-14 cursor-pointer items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-2xl font-bold text-white hover:from-[#06706d] hover:to-[#334c8b] disabled:cursor-not-allowed disabled:opacity-70"
              text="Crear Rol"
              icon="fa-solid fa-floppy-disk"
            />
          </div>
        </form>
      </div>
    </section>
  );
}