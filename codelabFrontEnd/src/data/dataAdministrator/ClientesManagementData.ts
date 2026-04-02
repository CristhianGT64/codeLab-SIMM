import type { ButtonsInterface } from "../../interfaces/ButtonInterface/ButtonsInterface";

export const botonVerGestionClientes: ButtonsInterface = {
  typeButton: "button",
  onClick: () => {},
  disabled: false,
  className:
    "hover:text-[#1498b2] px-6 pt-2 text-base font-medium md:text-xl cursor-pointer flex items-center gap-2",
  text: "Gestión de Clientes",
  icon: "fa-solid fa-users",
};

export const botonVerTiposCliente: ButtonsInterface = {
  typeButton: "button",
  onClick: () => {},
  disabled: false,
  className:
    "hover:text-[#1498b2] px-6 pt-2 text-base font-medium md:text-xl cursor-pointer flex items-center gap-2",
  text: "Tipo de clientes",
  icon: "fa-solid fa-tags",
};
