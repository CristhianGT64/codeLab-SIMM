import type { ButtonsInterface } from "../../interfaces/ButtonInterface/ButtonsInterface";

export const botonMenosCarrito : ButtonsInterface = {
    text : "",
    typeButton : "button",
    className : "p-1 hover:bg-white rounded transition-colors text-[#4a6eb0]",
    icon : "fa-minus",
    onClick : () => {},
    disabled : false,
    labelClassName : "",
    ariaLabel : "",
}

export const botonMasCarrito : ButtonsInterface = {
    text : "",
    typeButton : "button",
    className : "p-1 hover:bg-white rounded transition-colors text-[#4a6eb0]",
    icon : "fa-plus",
    onClick : () => {},
    disabled : false,
    labelClassName : "",
    ariaLabel : "",
}

export const botonEliminarCarrito : ButtonsInterface = {
    text : "",
    typeButton : "button",
    className : "p-1 text-red-600 hover:bg-red-50 rounded transition-colors w-4 h-4",
    icon : "fa-trash",
    onClick : () => {},
    disabled : false,
    labelClassName : "",
    ariaLabel : "",
}
