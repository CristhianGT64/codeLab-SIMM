export interface Sucursal {
  id: string; // Recibido como string por el manejo de BigInt.
  nombre: string;
  direccion: string;
  telefono: string;
  gerente: string;
  activa: boolean;
  createdAt?: string;
}

export interface SucursalResponse {
  success: boolean;
  data: Sucursal | Sucursal[];
  message?: string;
}