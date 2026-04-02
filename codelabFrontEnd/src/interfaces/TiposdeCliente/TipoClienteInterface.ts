export interface TipoCliente {
  id: string;
  nombre: string;
  descripcion: string | null;
  condicionPago: string | null;
  diasCredito: number;
  disponible: boolean;
  fechaCreacion: string;
  _count?: { clientes: number };
}

export interface TipoClienteResponse {
  success: boolean;
  data: TipoCliente[];
  message?: string;
}

export interface TipoClienteSingleResponse {
  success: boolean;
  data: TipoCliente;
  message?: string;
}
