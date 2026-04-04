export type FacturaEstado = "pagada" | "pendiente" | "anulada";

export interface FacturaTotalesHistorial {
  exento: number;
  gravado15: number;
  gravado18: number;
  isv15: number;
  isv18: number;
  total: number;
}

export interface FacturaClienteResumen {
  nombre: string;
  identificacion: string | null;
}

export interface FacturaUsuarioResumen {
  nombre: string;
  usuario: string | null;
}

export interface FacturaSucursalResumen {
  nombre: string;
  direccion: string | null;
}

export interface FacturaCaiResumen {
  codigo: string;
  fechaLimite: string | null;
}

export interface FacturaRangoEmisionResumen {
  inicio: number;
  fin: number;
}

export interface FacturaHistorialDetalleItem {
  id: string;
  productoId: string;
  producto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  tasaImpuesto: number;
  montoImpuesto: number;
  tipoImpuesto: string;
}

export interface FacturaHistorialItem {
  facturaId: string;
  numeroFactura: string;
  fechaEmision: string | null;
  clienteId: string | null;
  usuarioId: string | null;
  sucursalId: string | null;
  ventaId: string | null;
  estadoFactura: FacturaEstado;
  saldoPendiente: number;
  detallesCount: number;
  cliente: FacturaClienteResumen | null;
  usuario: FacturaUsuarioResumen | null;
  sucursal: FacturaSucursalResumen | null;
  totales: FacturaTotalesHistorial;
}

export interface FacturaHistorialDetail extends FacturaHistorialItem {
  detalles: FacturaHistorialDetalleItem[];
  cai: FacturaCaiResumen | null;
  rangoEmision: FacturaRangoEmisionResumen | null;
}

export interface FacturaHistorialFilters {
  clienteId?: string;
  fechaInicio?: string;
  fechaFin?: string;
  sucursalId?: string;
  usuarioId?: string;
}
