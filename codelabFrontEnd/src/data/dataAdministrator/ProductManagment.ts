import type { HeaderAdmin } from "../../interfaces/Headers/HeaderInterface";
import type { InformacionImportanteInterface } from "../../interfaces/informacionImportante/InformacionImportanteInterface";
import type { FormProducts } from "../../interfaces/Products/FormProducts";

export const HeaderTableProductData: string[] = [
  "Nombre del Producto",
  "Codigo SKU",
  "Categoria",
  "Precio Venta",
  "Costo",
  "Margen %",
  "Stock",
  "Stock Minimo",
  "Estado",
  "Acciones",
];

export const HeaderNuevoProducto: HeaderAdmin = {
  title: "Nuevo Producto",
  subTitle: "Completa el formulario para registrar un nuevo producto",
};

export const HeaderActualizarProducto: HeaderAdmin = {
  title: "Actualizar Producto",
  subTitle: "Modifica la informacion del producto seleccionado",
};

export const HeaderProducts: HeaderAdmin = {
  title: "Gestion de Productos",
  subTitle: "Administra el catalogo de productos del sistema",
};

export const InformacionImportanteProducto: InformacionImportanteInterface = {
  titulo: "Informacion importante",
  puntos: [
    "El codigo SKU debe ser unico para cada producto",
    "El precio de venta debe ser mayor al costo del producto",
    "La imagen es opcional pero recomendada para mejor visualizacion",
    "El stock inicial puede ser modificado posteriormente",
    "El stock minimo permite generar alertas automaticas por bajo inventario",
  ],
};

export const InitialProductForm: FormProducts = {
  nombre: "",
  sku: "",
  categoriaId: "",
  impuestoId: "",
  costo: "",
  precioVenta: 0,
  unidadMedida: "",
  stockInicial: 0,
  stockMinimo: 0,
  sucursalId: "",
  imagen: null,
};
