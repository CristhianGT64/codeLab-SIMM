import type { HeaderAdmin } from "../../interfaces/Headers/HeaderInterface";
import type { InformacionImportanteInterface } from "../../interfaces/informacionImportante/InformacionImportanteInterface";
import type { FormProducts } from "../../interfaces/Products/FormProducts";

export const HeaderTableProductData: string[] = [
  "Nombre del Producto",
  "Código SKU",
  "Categoría",
  "Precio Venta",
  "Costo",
  "Margen %",
  "Stock",
  "Estado",
  "Acciones",
];

export const HeaderNuevoProducto: HeaderAdmin = {
  title: "Nuevo Producto",
  subTitle: "Completa el formulario para registrar un nuevo producto",
};

export const HeaderActualizarProducto: HeaderAdmin = {
  title: "Actualizar Producto",
  subTitle: "Modifica la información del producto seleccionado",
};

export const HeaderProducts: HeaderAdmin = {
  title: "Gestión de Productos",
  subTitle: "Administra el catálogo de productos del sistema",
};

export const InformacionImportanteProducto: InformacionImportanteInterface = {
  titulo: "Información importante",
  puntos: [
    "El código SKU debe ser único para cada producto",
    "El precio de venta debe ser mayor al costo del producto",
    "La imagen es opcional pero recomendada para mejor visualización",
    "El stock inicial puede ser modificado posteriormente",
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
  sucursalId: "",
  imagen: null,
};
