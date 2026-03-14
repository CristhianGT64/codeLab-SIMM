import type { NotificationStateInterface } from "../../interfaces/NotificacionesInterface";
import type { HeaderAdmin } from "../../interfaces/Headers/HeaderInterface";
import type { InformacionImportanteInterface } from "../../interfaces/informacionImportante/InformacionImportanteInterface";
import type { ButtonsInterface } from "../../interfaces/ButtonInterface/ButtonsInterface";

/* Titulo */

export const tituloEntradaInventario: HeaderAdmin = {
  title: "Registrar Entrada de Productos",
  subTitle: "Completa el formulario para registrar una entrada de inventario",
};

/* Notificaciones */
export const notificacionErrorSucursal: NotificationStateInterface = {
  isVisible: true,
  variant: "error",
  title: "Sucursal no disponible",
  message: "No se encontro la sucursal del usuario autenticado.",
};

export const notificacionErrorCantidad: NotificationStateInterface = {
  isVisible: true,
  variant: "error",
  title: "Cantidad invalida",
  message: "La cantidad debe ser mayor a 0.",
};

export const notificacionRegistroEntradaExitoso: NotificationStateInterface = {
  isVisible: true,
  variant: "success",
  title: "Entrada registrada",
  message: "La entrada de inventario se registro correctamente.",
};

export const notificacionErorrRegistroEntrada: NotificationStateInterface = {
  isVisible: true,
  variant: "error",
  title: "No se pudo registrar",
  message: "La operacion no pudo completarse. Intenta de nuevo.",
};

export const informacionImpEntradaInventario: InformacionImportanteInterface = {
  titulo: "Informacion importante",
  puntos: [
    "El stock se actualizara automaticamente al guardar.",
    "Verifica que la cantidad y el proveedor sean correctos.",
    "Este movimiento quedara registrado en el historial.",
  ],
};

export const botonCancelarEntrada: ButtonsInterface = {
  typeButton: "button",
  onClick: () => {},
  disabled: false,
  className:
    "h-14 cursor-pointer rounded-2xl border-2 border-[#9adce2] bg-white text-2xl font-semibold text-[#4661b0] hover:bg-[#edf8fa] disabled:cursor-not-allowed disabled:opacity-70",
  text: "Cancelar",
  icon: "",
};

export const botonGuardarEntrada: ButtonsInterface = {
  typeButton: "submit",
  onClick: () => {},
  disabled: false,
  className:
    "inline-flex h-14 cursor-pointer items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-2xl font-bold text-white hover:from-[#06706d] hover:to-[#334c8b] disabled:cursor-not-allowed disabled:opacity-70",
  text: "Guardar Entrada",
  icon: "fa-solid fa-floppy-disk",
};