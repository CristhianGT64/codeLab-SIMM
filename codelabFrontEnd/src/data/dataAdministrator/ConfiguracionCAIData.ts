import type { Ialertas } from "../../interfaces/Alertas/Ialertas";
import type { ButtonsInterface } from "../../interfaces/ButtonInterface/ButtonsInterface";
import type { HeaderAdmin } from "../../interfaces/Headers/HeaderInterface";
import type { IestadosObjetos } from "../../interfaces/IestadosObjetos";

export const titleConfiguracionCAI: HeaderAdmin = {
  title: "Configuración CAI",
  subTitle: "Administra la configuración de CAI de la empresa",
};

export const estadoCaiValido: IestadosObjetos = {
  className:
    "bg-[#dbfce7] text-[#168e48] px-3 py-1 rounded-full text-lg font-medium flex items-center",
  svgD: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  mensaje: "Vigente",
};

export const estadoCaiProxVencer: IestadosObjetos = {
  className:
    "bg-[#fef3c6] text-[#bb5513] px-3 py-1 rounded-full text-lg font-medium flex items-center",
  svgD: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z",
  mensaje: "Próximo a vencer",
};

export const estadoCaiVencido: IestadosObjetos = {
  className:
    "bg-[#ffe2e2] text-[#d02f21] px-3 py-1 rounded-full text-lg font-medium flex items-center",
  svgD: "m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  mensaje: "CAI vencido",
};

export const estadoCaiRangoAgotado: IestadosObjetos = {
  className:
    "bg-[#ffe2e2] text-[#d02f21] px-3 py-1 rounded-full text-lg font-medium flex items-center",
  svgD: "m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  mensaje: "Rango agotado",
};

export const alertaCaiVencido: Ialertas = {
  svgD: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z",
  colorSvg: "#ec1919",
  bg: "#ffe2e2",
  colorBorder: "#ec1919",
  title: "Alerta de Vencimiento",
  message:
    "La fecha de emision del CAI esta vencido. Se recomienda tramitar un nuevo CAI con la SAR para reanudar la facturación.",
  colorTitle: "#8f1105ff",
  colorMessage: "#8f1105ff",
};

export const alertaCaiPorAgotar: Ialertas = {
  svgD: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z",
  colorSvg: "#FF9900",
  bg: "#FFF4E5",
  colorBorder: "#FF9900",
  title: "Alerta de Rango Próximo a Agotarse",
  message:
    "El rango de facturación está próximo a agotarse. Se recomienda tramitar un nuevo CAI con la SAR para evitar interrupciones en la facturación.",
  colorTitle: "#7b3c13",
  colorMessage: "#945b28",
};
export const alertaCaiRangoAgotado: Ialertas = {
  svgD: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z",
  colorSvg: "#ec1919",
  bg: "#ffe2e2",
  colorBorder: "#ec1919",
  title: "Alerta de Rango Agotado",
  message:
    "El rango de facturación está próximo a agotarse o el CAI está porvencer. Se recomienda tramitar un nuevo CAI con la SAR para reanudar la facturación.",
  colorTitle: "#8f1105ff",
  colorMessage: "#8f1105ff",
};

export const botonGenerarNuevoCAI: ButtonsInterface = {
  text: "Registrar CAI",
  typeButton: "button",
  className:
    "mt-3 cursor-pointer flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] hover:from-[#034d4a] hover:to-[#2c3d70] px-6 text-base font-semibold text-white md:text-lg",
  icon: "fa-solid fa-plus",
  onClick: () => {},
  disabled: false,
};

export const tituloTablaCaisEmitidos: string[] = [
  "Número de CAI",
  "Rango",
  "Vencimiento",
  "Última Factura",
  "Estado",
];
