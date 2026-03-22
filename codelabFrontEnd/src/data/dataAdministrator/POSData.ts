import type { ButtonsInterface } from "../../interfaces/ButtonInterface/ButtonsInterface";
import type { HeaderAdmin } from "../../interfaces/Headers/HeaderInterface";

export const HeaderPOS : HeaderAdmin  = {
    title: "Punto de Venta",
    subTitle: "Realiza ventas rápidas y eficientes",
}

export const bottonEliminar : ButtonsInterface = {
    text : "Eliminar",
    typeButton : "button",
    className : "px-4 py-2 border-2 border-red-400 text-red-600 rounded-lg hover:bg-red-50 transition-colors",
    icon : "fa-trash",
    onClick : () => {},
    disabled : false,
    labelClassName : "",
    ariaLabel : "Eliminar",
}

export const botonFinalizarVenta : ButtonsInterface = {
    text : "Finalizar Venta",
    typeButton : "button",
    className : "",
    icon : "fa-check",
    onClick : () => {},
    disabled : false,
    labelClassName : "",
    ariaLabel : "Finalizar Venta",
}