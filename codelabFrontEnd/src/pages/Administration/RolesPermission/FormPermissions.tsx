import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faShield } from "@fortawesome/free-solid-svg-icons";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";

const mockCategorias = [
  { id: 1, nombre: "Usuarios" },
  { id: 2, nombre: "Productos" },
  { id: 3, nombre: "Sucursales" },
  { id: 4, nombre: "Reportes" },
  { id: 5, nombre: "Configuración" },
];

export default function FormPermissions() {
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
          <h2 className="text-4xl font-bold text-[#0a4d76]">
            Agregar Nuevo Permiso
          </h2>
          <p className="mt-2 text-2xl text-[#4661b0]">
            Crea un nuevo permiso para asignarlo a los roles del sistema
          </p>
        </header>

        <form className="mt-8 rounded-2xl bg-[#f4f6f8] p-6 shadow-[0_6px_16px_rgba(0,0,0,0.1)] md:p-8">
          {/* Icono decorativo */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-[#0aa6a2] to-[#4661b0]">
              <FontAwesomeIcon
                icon={faShield}
                className="text-3xl text-white"
              />
            </div>
          </div>

          {/* Nombre del Permiso */}
          <div>
            <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
              Nombre del Permiso <span className="text-[#ff4f4f]">*</span>
            </p>
            <input
              id="nombrePermiso"
              type="text"
              placeholder="Ej: Ver reportes de ventas"
              className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
            />
            <p className="mt-1 text-sm text-[#6a758f]">
              Usa un nombre descriptivo y claro de la acción que permite
            </p>
          </div>

          {/* Descripción */}
          <div className="mt-6">
            <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
              Descripción <span className="text-[#ff4f4f]">*</span>
            </p>
            <textarea
              id="descripcion"
              rows={3}
              placeholder="Describe detalladamente qué permite hacer este permiso en el sistema"
              className="w-full resize-none rounded-2xl border-2 border-[#9adce2] bg-white px-5 py-4 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
            />
          </div>

          {/* Categoría / Módulo */}
          <div className="mt-6">
            <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
              Categoría / Módulo <span className="text-[#ff4f4f]">*</span>
            </p>

            {/* Tabs de selección */}
            <div className="mb-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="h-12 cursor-pointer rounded-xl bg-[#0aa6a2] text-base font-semibold text-white"
              >
                Categoría Existente
              </button>
              <button
                type="button"
                className="h-12 cursor-pointer rounded-xl border-2 border-[#9adce2] bg-white text-base font-semibold text-[#4661b0] hover:bg-[#edf8fa]"
              >
                Nueva Categoría
              </button>
            </div>

            {/* Select de categoría existente */}
            <select
              id="categoria"
              className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#111111] outline-none focus:border-[#0aa6a2]"
            >
              <option value="">Seleccionar categoría</option>
              {mockCategorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-[#6a758f]">
              Selecciona una categoría{" "}
              <span className="font-semibold">existente</span> para organizar
              este permiso
            </p>
          </div>

          {/* Información importante */}
          <div className="mt-6 rounded-xl border-l-4 border-[#0aa6a2] bg-[#e8f3f5] p-5">
            <h3 className="text-3xl font-bold text-[#0a4d76]">
              Información importante
            </h3>
            <ul className="mt-3 list-disc space-y-1 pl-6 text-xl text-[#4661b0]">
              <li>
                Los permisos nuevos estarán disponibles inmediatamente para
                asignar a roles
              </li>
              <li>
                Usa nombres claros y específicos para facilitar su
                identificación
              </li>
              <li>
                La categoría ayuda a organizar los permisos por módulos
                funcionales
              </li>
              <li>
                Puedes crear nuevas categorías o usar las existentes del sistema
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
              text="Crear Permiso"
              icon="fa-solid fa-floppy-disk"
            />
          </div>
        </form>
      </div>
    </section>
  );
}