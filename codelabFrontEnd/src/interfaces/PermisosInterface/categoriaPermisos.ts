export interface CategoriaPermiso {
  id: string;
  nombreCategoria: string;
  disponible: string;
}

export interface ResponseCategoriaPermiso {
  success: boolean;
  data: CategoriaPermiso[];
}

export interface FormPermission {
  nombre: string;
  descripcion: string;
  categoriaId: number;
}

export const FormPermissionEmpty: FormPermission = {
  nombre: "",
  descripcion : "",
  categoriaId: 0,
};
