import type { HeaderAdmin } from "../../interfaces/Headers/HeaderInterface";
import type { InformacionImportanteInterface } from "../../interfaces/informacionImportante/InformacionImportanteInterface";

export const HeaderImpuestosManagement: HeaderAdmin = {
  title: "Configuracion de Impuestos",
  subTitle: "Crea, consulta y actualiza los impuestos disponibles para productos y ventas.",
};

export const HeaderNuevoImpuesto: HeaderAdmin = {
  title: "Nuevo impuesto",
  subTitle: "Registra un impuesto indicando su nombre comercial y porcentaje.",
};

export const HeaderEditarImpuesto: HeaderAdmin = {
  title: "Editar impuesto",
  subTitle: "Actualiza la configuracion del impuesto seleccionado.",
};

export const HeaderTableImpuestos = [
  "Nombre",
  "Porcentaje",
  "Tasa decimal",
  "Estado",
  "Acciones",
];

export const InformacionImportanteImpuestos: InformacionImportanteInterface = {
  titulo: "Informacion Importante",
  puntos: [
    "Ingresa el porcentaje en formato natural, por ejemplo 15 para ISV 15%.",
    "La tasa decimal se genera automaticamente para mantener compatibilidad con productos y facturacion.",
    "Cualquier cambio en el impuesto afectara nuevas configuraciones y asignaciones posteriores.",
  ],
};
