export interface FacturaRequest {
  usuarioId: string | number;
  sucursalId: string | number;
  ventaId: string | number;
}

export interface FacturaDetalle {
  producto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface FacturaTotales {
  exento: number;
  gravado15: number;
  gravado18: number;
  isv15: number;
  isv18: number;
  total: number;
}

export interface FacturaData {
  facturaId: string;
  numeroFactura: string;
  fechaEmision: string;
  cliente: { nombre: string } | null;
  usuario: { nombre: string };
  sucursal: { nombre: string; direccion: string };
  detalles: FacturaDetalle[];
  totales: FacturaTotales;
  cai: { codigo: string; fechaLimite: string };
  rangoEmision: { inicio: number; fin: number };
}

export interface FacturaResponse {
  success: boolean;
  data: FacturaData;
}
