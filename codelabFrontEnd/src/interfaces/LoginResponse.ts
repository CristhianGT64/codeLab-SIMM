export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginRole {
  id: string;
  nombre: string;
}

export interface LoginBranch {
  id: string;
  nombre: string;
}

export interface LoginUserData {
  id: string;
  nombreCompleto: string;
  correo: string;
  usuario: string;
  estado: string;
  eliminado: boolean;
  rol: LoginRole;
  sucursal: LoginBranch;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginUserData;
}
