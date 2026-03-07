export interface FormProducts {
  nameProduct: string;
  sku: string;
  categorie: string;
  productCost: number;
  priceSale: number;
  unit: string;
  stockInit: number;
  urlImage: string;
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

