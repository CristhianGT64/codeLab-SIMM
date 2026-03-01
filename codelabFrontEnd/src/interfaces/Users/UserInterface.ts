export interface User {
    id: string;
    nombreCompleto : string;
    correo : string;
    usuario : string;
    estado : string;
  rol: Rol;
  sucursal: Sucursal;
  createdAt : string | null;
  updatedAt : string | null;
}

export interface Rol {
  id: string;
  nombre: string;
}

export interface Sucursal {
  id: string;
  nombre: string;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
}

export interface booleanResponse {
  success: boolean;
}
