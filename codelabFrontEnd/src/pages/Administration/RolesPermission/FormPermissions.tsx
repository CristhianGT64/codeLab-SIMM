import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faShield } from "@fortawesome/free-solid-svg-icons";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";
import useListCategoriaPermisos from "../../../hooks/PermisosHook/useListCategoriaPermisos";
import {
  type FormPermission,
  FormPermissionEmpty,
} from "../../../interfaces/PermisosInterface/categoriaPermisos";
import InfImportante from "../../../components/informacionImportante/InfImportante";
import {
  InformacionImportantePermisos,
  HeaderCreatePermission,
} from "../../../data/dataAdministrator/PermissionDataAdmin";
import useCreatePermission from "../../../hooks/PermisosHook/useCreateHook";
import StatusNotification from "../../../components/notifications/StatusNotification";
import {
  type NotificationStateInterface,
  NotificacionData,
} from "../../../interfaces/NotificacionesInterface";
import { useNavigate } from "react-router";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";

export default function FormPermissions() {
  const { data: categoriaPermisosData } = useListCategoriaPermisos();
  const [isNewCategory, setIsNewCategory] = useState<boolean>(false);
  const categoriaPermisos = categoriaPermisosData?.data ?? [];
  const { mutateAsync: createPermisionMatuation, isSuccess: permissionSucces } =
    useCreatePermission();
  const [notification, setNotification] =
    useState<NotificationStateInterface>(NotificacionData);
  const [form, setForm] = useState<FormPermission>(FormPermissionEmpty);
  const navigate = useNavigate();

  const onChangeField =
    (field: keyof FormPermission) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const onSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const created = await createPermisionMatuation(form);

      if (created || permissionSucces) {
        setNotification({
          isVisible: true,
          variant: "success",
          title: "Permiso creado",
          message: "El permiso se creo correctamente.",
        });

        globalThis.setTimeout(() => {
          navigate("/RolesPermision-Management");
        }, 1300);

        return;
      }

      setNotification({
        isVisible: true,
        variant: "error",
        title: "No se pudo crear el permiso",
        message:
          "La operacion no pudo completarse. Intenta de nuevo en unos segundos.",
      });
    } catch {
      setNotification({
        isVisible: true,
        variant: "error",
        title: "No se pudo crear el permiso",
        message:
          "La operacion no pudo completarse. Intenta de nuevo en unos segundos.",
      });
    }
  };

  return (
    <section className="w-full px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-220">
        <button
          onClick={() => navigate("/RolesPermision-Management")}
          type="button"
          className="inline-flex cursor-pointer items-center gap-2 text-base font-semibold text-[#0aa6a2] hover:text-[#06706d]"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
          <span className="text-[32px] leading-none">Volver al listado</span>
        </button>

        <HeaderTitleAdmin {...HeaderCreatePermission} />

        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-2xl bg-[#f4f6f8] p-6 shadow-[0_6px_16px_rgba(0,0,0,0.1)] md:p-8"
        >
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
              onChange={onChangeField("nombre")}
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
              onChange={onChangeField("descripcion")}
              rows={2}
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
            {}
            <div className="mb-4 grid grid-cols-2 gap-2">
              <ButtonsComponet
                text="Categoría Existente"
                typeButton="button"
                icon=""
                className={`h-12 cursor-pointer rounded-xl ${isNewCategory ? "border-2 border-[#9adce2] bg-white text-[#4661b0] hover:bg-[#edf8fa]" : "bg-[#0aa6a2] text-white"} text-base font-semibold `}
                onClick={() => setIsNewCategory(false)}
                disabled={false}
              />
              <ButtonsComponet
                text="Nueva Categoría"
                typeButton="button"
                className={`h-12 cursor-pointer rounded-xl ${isNewCategory ? "bg-[#0aa6a2] text-white " : "border-2 border-[#9adce2] bg-white text-[#4661b0] hover:bg-[#edf8fa]"} text-base font-semibold `}
                icon=""
                onClick={() => setIsNewCategory(true)}
                disabled={false}
              />
            </div>

            {/* Select de categoría existente */}
            {/* nuevo permiso */}
            {isNewCategory ? (
              <input
                id="nombrePermiso"
                type="text"
                placeholder="Ej: Reportes, Inventario, Ventas"
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            ) : (
              <select
                onChange={onChangeField("categoriaId")}
                id="categoria"
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#111111] outline-none focus:border-[#0aa6a2]"
                required
              >
                <option value="">Seleccionar categoría</option>
                {categoriaPermisos.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombreCategoria}
                  </option>
                ))}
              </select>
            )}

            {isNewCategory ? (
              <p className="mt-1 text-sm text-[#6a758f]">
                Crea una nueva categoría para agrupar permisos relacionados
              </p>
            ) : (
              <p className="mt-1 text-sm text-[#6a758f]">
                Selecciona una categoría{" "}
                <span className="font-semibold">existente</span> para organizar
                este permiso
              </p>
            )}
          </div>

          {/* Información importante */}
          <InfImportante {...InformacionImportantePermisos} />

          {/* Botones de acción */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <ButtonsComponet
              typeButton="button"
              onClick={() => navigate("/RolesPermision-Management")}
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

      <StatusNotification
        {...notification}
        onClose={() =>
          setNotification((prev) => ({ ...prev, isVisible: false }))
        }
      />
    </section>
  );
}
