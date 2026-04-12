export type ClientType = 'Contado' | 'Crédito' | 'Mayorista' | 'Minorista';

export interface Invoice {
  id: string;
  numero: string;
  fecha: string;
  total: number;
  estado: 'Pagada' | 'Pendiente' | 'Vencida';
}

export interface Client {
  id: string;
  nombreCompleto: string;
  identificacion: string;
  telefono: string;
  correo: string;
  direccion: string;
  tipoClienteId: string;
  tipoCliente: string;
}

export interface ClientDetail extends Client {
  totalFacturado: number;
  totalPagado: number;
  totalPendiente: number;
  facturas: Invoice[];
}

export interface CreateClientPayload {
  nombreCompleto: string;
  identificacion: string;
  telefono: string;
  correo: string;
  direccion: string;
  tipoClienteId: string;
  tipoCliente: string;
}

export type UpdateClientPayload = CreateClientPayload;
