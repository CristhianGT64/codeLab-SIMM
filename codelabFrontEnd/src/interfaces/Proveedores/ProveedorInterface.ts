export interface ProveedorItem {
  id: string;
  nombre: string;
  telefono?: string | null;
  correo?: string | null;
  direccion?: string | null;
  disponible: boolean;
}

export interface ProveedorResponse {
  success: boolean;
  data: ProveedorItem[];
}