import type { Permisos } from "./PermisosInterface";

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

export interface CreateCategoriaPermission {
  nombreCategoria: string;
}

export const CreateCategoriaPermissionEmpy: CreateCategoriaPermission = {
  nombreCategoria: "",
};

export interface ResponseCategoryPermission {
  success: boolean;
  data: CategoriaPermiso;
}

export const FormPermissionEmpty: FormPermission = {
  nombre: "",
  descripcion: "",
  categoriaId: 0,
};

export interface PermisosXCategoria {
  id: string;
  nombreCategoria: string;
  disponible: string;
  permisos : Permisos[]
}

export interface ResponsePermisosXCategoria {
  success : boolean,
  data : PermisosXCategoria[]
}