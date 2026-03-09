import type { ButtonsInterface } from "../../interfaces/ButtonInterface/ButtonsInterface";
import type { HeaderAdmin } from "../../interfaces/Headers/HeaderInterface";
import type { InformacionImportanteInterface } from "../../interfaces/informacionImportante/InformacionImportanteInterface";
import type { NotificationStateInterface } from "../../interfaces/NotificacionesInterface";

export const headerFormRoles: HeaderAdmin = {
  title: "Nuevo Rol",
  subTitle: "Completa el formulario para crear un nuevo rol",
};

export const headerEditFormRoles: HeaderAdmin = {
  title: "Editar Rol",
  subTitle: "Modifica la información y permisos de este rol",
};

export const informacionImportanteRoles: InformacionImportanteInterface = {
  titulo: "Información importante para roles",
  puntos: [
    "El nombre del rol debe ser único en el sistema",
    "Los permisos se aplicarán inmediatamente al guardar los cambios",
    "Los cambios en permisos afectarán a todos los usuarios con este rol",
  ],
};

export const botonCancelar: ButtonsInterface = {
  typeButton: "button",
  onClick: () => {},
  disabled: false,
  className:
    "h-14 cursor-pointer rounded-2xl border-2 border-[#9adce2] bg-white text-2xl font-semibold text-[#4661b0] hover:bg-[#edf8fa]",
  text: "Cancelar",
  icon: "fa-solid fa-arrow-left",
};

export const botonCrearRol: ButtonsInterface = {
  typeButton: "submit",
  onClick: () => {},
  disabled: false,
  className:
    "inline-flex h-14 cursor-pointer items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-2xl font-bold text-white hover:from-[#06706d] hover:to-[#334c8b] disabled:cursor-not-allowed disabled:opacity-70",
  text: "Crear Rol",
  icon: "fa-solid fa-floppy-disk",
};

export const botonEditarRol: ButtonsInterface = {
  typeButton: "submit",
  onClick: () => {},
  disabled: false,
  className:
    "inline-flex h-14 cursor-pointer items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-2xl font-bold text-white hover:from-[#06706d] hover:to-[#334c8b] disabled:cursor-not-allowed disabled:opacity-70",
  text: "Guardar Cambios",
  icon: "fa-solid fa-floppy-disk",
};

export const notificacionExitoRol: NotificationStateInterface = {
  isVisible: true,
  variant: "success",
  title: "Rol creado",
  message: "El Rol se creo correctamente.",
};
export const notificacionFracasoRol: NotificationStateInterface = {
  isVisible: true,
  variant: "error",
  title: "No se pudo crear el Rol",
  message:
    "La operacion no pudo completarse. Intenta de nuevo en unos segundos.",
};

export const notificacionExitoEditarRol: NotificationStateInterface = {
  isVisible: true,
  variant: "success",
  title: "Rol actualizado",
  message: "El Rol se actualizó correctamente.",
};

export const notificacionFracasoEditarRol: NotificationStateInterface = {
  isVisible: true,
  variant: "error",
  title: "No se pudo actualizar el Rol",
  message:
    "La operacion no pudo completarse. Intenta de nuevo en unos segundos.",
};
