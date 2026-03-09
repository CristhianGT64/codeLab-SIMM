import type { ButtonsInterface } from "../../interfaces/ButtonInterface/ButtonsInterface";
import type { HeaderAdmin } from "../../interfaces/Headers/HeaderInterface";
import type { InformacionImportanteInterface } from "../../interfaces/informacionImportante/InformacionImportanteInterface";
import type { NotificationStateInterface } from "../../interfaces/NotificacionesInterface";

export const InformacionImportantePermisos: InformacionImportanteInterface = {
  titulo: "Información importante para permisos",
  puntos: [
    "Los permisos nuevos estarán disponibles inmediatamente para asignar a roles",
    "Usa nombres claros y específicos para facilitar su identificación",
    "La categoría ayuda a organizar los permisos por módulos funcionales",
    "Puedes crear nuevas categorías o usar las existentes del sistema",
  ],
};

export const HeaderCreatePermission: HeaderAdmin = {
  title: "Agregar Nuevo Permiso",
  subTitle: "Crea un nuevo permiso para asignarlo a los roles del sistema",
};

export const notificacionExito: NotificationStateInterface = {
  isVisible: true,
  variant: "success",
  title: "Permiso creado",
  message: "El permiso se creo correctamente.",
};
export const notificacionFracaso: NotificationStateInterface = {
  isVisible: true,
  variant: "error",
  title: "No se pudo crear el permiso",
  message:
    "La operacion no pudo completarse. Intenta de nuevo en unos segundos.",
};

export const buttonCancelar: ButtonsInterface = {
  typeButton: "button",
  onClick: () => {},
  disabled: false,
  className:
    "h-14 cursor-pointer rounded-2xl border-2 border-[#9adce2] bg-white text-2xl font-semibold text-[#4661b0] hover:bg-[#edf8fa]",
  text: "Cancelar",
  icon: "fa-solid fa-arrow-left",
};

export const buttonCrearPermiso: ButtonsInterface = {
  typeButton: "submit",
  onClick: () => {},
  disabled: false,
  className:
    "inline-flex h-14 cursor-pointer items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-2xl font-bold text-white hover:from-[#06706d] hover:to-[#334c8b] disabled:cursor-not-allowed disabled:opacity-70",
  text: "Crear Permiso",
  icon: "fa-solid fa-floppy-disk",
};
