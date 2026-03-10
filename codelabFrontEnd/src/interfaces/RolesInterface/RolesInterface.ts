export interface Rol {
    id : string;
    nombre : string;
    descripcion : string;
    disponible : boolean;
    createdAt : string | null;
}
export interface Rol {
    id : string;
    nombre : string;
    descripcion : string;
    disponible : boolean;
    createdAt : string | null;
    totalUsuariosRol : number;
    totalPermisosRol : number;
}

export default interface RolResponse {
      success: boolean;
      data: Rol[];
}

export interface CreateRolResponse {
      success: boolean;
      data: Rol;
}

export interface PermisoDeRol {
  id: string;
  nombre: string;
  descripcion: string;
  disponible: boolean;
  createdAt: string | null;
  categoriaId: string;
}

export interface RolDetalle {
  id: string;
  nombre: string;
  descripcion: string;
  permisos: PermisoDeRol[];
}

export interface RolByIdResponse {
  success: boolean;
  data: RolDetalle;
}

export interface FormRol {
    nombre : string,
    descripcion : string
} 

export const RolEmpty : FormRol = {
    nombre : '',
    descripcion : ''
}

