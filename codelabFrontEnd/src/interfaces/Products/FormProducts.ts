export interface FormProducts {
  nombre: string;
  sku: string;
  categoriaId: string;
  costo: string;
  precioVenta: number;
  unidadMedida: string;
  stockInicial: number;
  sucursalId: string;
  imagen: File | null;
}

export interface Categoria {
  id: string;
  nombre: string;
}

export interface Inventarios {
  sucursalId: string;
  stockActual: number;
}
export interface ProductoDto {
  id: string;
  nombre: string;
  sku: string;
  costo: number;
  precioVenta: number;
  unidadMedida: string;
  imagenPath: number;
  estado: string;
  categoria: Categoria;
  inventarios : Inventarios []
  createdAt: string;
  updatedAt: string;
}

export interface ProductResponse {
      success: boolean;
      data: ProductoDto[];
}

export interface CategoriaProducto {
    id : string;
    nombre : string;
    descripcion : string;
    disponible : boolean
}

export interface ResponseCategoriaProducto {
    success : boolean;
    data : CategoriaProducto[];
}

