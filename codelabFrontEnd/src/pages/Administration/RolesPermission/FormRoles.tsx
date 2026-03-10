import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";
import InfImportante from "../../../components/informacionImportante/InfImportante";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import {
  botonCancelar,
  headerFormRoles,
  headerEditFormRoles,
  informacionImportanteRoles,
  notificacionExitoRol,
  notificacionFracasoRol,
  notificacionExitoEditarRol,
  notificacionFracasoEditarRol,
  botonCrearRol,
  botonEditarRol,
} from "../../../data/dataAdministrator/RolesDataAdmin";
import { useNavigate, useParams } from "react-router";
import useListPermisosxCategoria from "../../../hooks/PermisosHook/useListPermisosxCategoria";
import CardEligirRoles from "../../../components/cardPermissionRoles/CardEligirRoles";
import useCreateRol from "../../../hooks/RolesHooks/useCreateRol";
import useAssignPermissionsToRole from "../../../hooks/RolesHooks/useAssignPermissionsToRole";
import useReadRolById from "../../../hooks/RolesHooks/useReadRolById";
import useUpdateRolPermissions from "../../../hooks/RolesHooks/useUpdateRolPermissions";
import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import {
  RolEmpty,
  type FormRol,
} from "../../../interfaces/RolesInterface/RolesInterface";
import {
  NotificacionData,
  type NotificationStateInterface,
} from "../../../interfaces/NotificacionesInterface";
import StatusNotification from "../../../components/notifications/StatusNotification";

export default function FormRoles() {
  const navigate = useNavigate();
  const { data: permisosXCateData } = useListPermisosxCategoria();
  const permisosxCategoria = permisosXCateData?.data ?? [];
  const { mutateAsync: mutationCreateRol, isPending: isCreatingRol } = useCreateRol();
  const { mutateAsync: mutationAssignPermisos, isPending: isAssigning } = useAssignPermissionsToRole();
  const { mutateAsync: mutationUpdatePermisos, isPending: isUpdating } = useUpdateRolPermissions();
  const [form, setForm] = useState<FormRol>(RolEmpty);
  const { id } = useParams<{
    id: string;
  }>();
  const isEditMode = Boolean(id);
  const { data: rolData } = useReadRolById(id ?? "");
  const [notificacion, setNotification] =
    useState<NotificationStateInterface>(NotificacionData);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<Set<string>>(new Set());

  const isPending = isCreatingRol || isAssigning || isUpdating;

  const botonSubmit = isEditMode ? botonEditarRol : botonCrearRol;
  const textoPending = isEditMode ? "Guardando cambios..." : "Creando rol...";
  const textoSubmit = isPending ? textoPending : botonSubmit.text;

  // llenar formulario y permisos cuando se carga el rol en modo edición
  useEffect(() => {
    if (rolData?.data) {
      const rol = rolData.data;
      setForm({ nombre: rol.nombre, descripcion: rol.descripcion });
      setPermisosSeleccionados(new Set(rol.permisos.map((p) => p.id)));
    }
  }, [rolData]);

  const permisosConElementos = permisosxCategoria.filter(
    (grupo) => Array.isArray(grupo.permisos) && grupo.permisos.length > 0,
  );

  const onChangeField =
    (field: keyof FormRol) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const createRol = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (isEditMode && id) {
        await mutationUpdatePermisos({
          roleId: id,
          permissions: Array.from(permisosSeleccionados),
        });

        setNotification({ ...notificacionExitoEditarRol });
        globalThis.setTimeout(() => {
          navigate("/RolesPermision-Management");
        }, 1300);
        return;
      }

      const rolResponse = await mutationCreateRol(form);
      const roleId = rolResponse.data.id;

      if (permisosSeleccionados.size > 0) {
        await mutationAssignPermisos({
          roleId,
          permissions: Array.from(permisosSeleccionados),
        });
      }

      setNotification({ ...notificacionExitoRol });
      globalThis.setTimeout(() => {
        navigate("/RolesPermision-Management");
      }, 1300);
    } catch {
      setNotification(
        isEditMode
          ? { ...notificacionFracasoEditarRol }
          : { ...notificacionFracasoRol },
      );
    }
  };

  /* Agregar/quitar permisos seleccionados */

  const togglePermiso = (permisoId: string) => {
    setPermisosSeleccionados((prev) => {
      const next = new Set(prev);
      if (next.has(permisoId)) {
        next.delete(permisoId);
      } else {
        next.add(permisoId);
      }
      return next;
    });
  };

  const toggleTodos = (ids: string[]) => {
    setPermisosSeleccionados((prev) => {
      const next = new Set(prev);
      const todosSeleccionados = ids.every((id) => next.has(id));
      if (todosSeleccionados) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
  };
  

  return (
    <section className="w-full px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-220">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-2 text-base font-semibold text-[#0aa6a2] hover:text-[#06706d]"
          onClick={() => {
            navigate("/RolesPermision-Management");
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
          <span className="text-[32px] leading-none">Volver al listado</span>
        </button>

        <HeaderTitleAdmin {...(isEditMode ? headerEditFormRoles : headerFormRoles)} />

        <form
          className="mt-8 rounded-2xl bg-[#f4f6f8] p-6 shadow-[0_6px_16px_rgba(0,0,0,0.1)] md:p-8"
          onSubmit={createRol}
        >
          {/* Nombre del Rol */}
          <div>
            <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
              Nombre del Rol <span className="text-[#ff4f4f]">*</span>
            </p>
            <input
              id="nombreRol"
              type="text"
              value={form.nombre}
              onChange={onChangeField("nombre")}
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
              value={form.descripcion}
              onChange={onChangeField("descripcion")}
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
                {permisosSeleccionados.size} de{" "}
                {permisosConElementos.reduce(
                  (acc, g) => acc + g.permisos.length,
                  0,
                )}{" "}
                seleccionados
              </span>
            </div>

            {/* Grupos de permisos */}
            <div className="mt-4 space-y-4">
              {permisosConElementos.map((grupo) => (
                <CardEligirRoles
                  key={grupo.id}
                  {...grupo}
                  permisosSeleccionados={permisosSeleccionados}
                  onTogglePermiso={togglePermiso}
                  onToggleTodos={toggleTodos}
                />
              ))}
            </div>
          </div>

          {/* Información importante */}
          <InfImportante {...informacionImportanteRoles} />
          {/* Botones de acción */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <ButtonsComponet
              {...botonCancelar}
              onClick={() => {
                navigate("/RolesPermision-Management");
              }}
            />

            <ButtonsComponet
              {...botonSubmit}
              text={textoSubmit}
              disabled={isPending}
            />
          </div>
        </form>
      </div>

      <StatusNotification
        {...notificacion}
        onClose={() =>
          setNotification((prev) => ({ ...prev, isVisible: false }))
        }
      />
    </section>
  );
}
