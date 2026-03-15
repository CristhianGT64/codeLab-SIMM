export interface Client {
  id: number;
  nombre: string;
  dni: string;
  telefono: string;
  email: string;
  tipo: 'Minorista' | 'Mayorista' | 'Crédito' | 'Contado';
}

export interface ClientDetail extends Client {
  totalFacturado: number;
  totalPagado: number;
  totalPendiente: number;
  facturas: Invoice[];
}

export interface Invoice {
  id: number;
  numero: string;
  fecha: string;
  total: number;
  estado: 'Pagada' | 'Pendiente' | 'Vencida';
}

export interface CreateClientPayload {
  nombre: string;
  dni: string;
  telefono: string;
  email: string;
  tipo: 'Minorista' | 'Mayorista' | 'Crédito' | 'Contado';
}

export interface UpdateClientPayload extends CreateClientPayload {}
