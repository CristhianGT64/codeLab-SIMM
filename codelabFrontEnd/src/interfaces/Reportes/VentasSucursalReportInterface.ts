export interface ReporteVentasSucursalFilters {
  fechaInicio?: string;
  fechaFin?: string;
  sucursalIds?: string[];
}

export interface ReporteVentasSucursalItem {
  sucursalId: string;
  sucursal: string;
  numeroTransacciones: number;
  totalVentas: number;
  ingresoGenerado: number;
}

export interface ReporteVentasSucursalResumen {
  totalVentasPeriodo: number;
  totalTransacciones: number;
  ingresoTotal: number;
  sucursalesAnalizadas: number;
}

export interface ReporteVentasSucursalResponse {
  items: ReporteVentasSucursalItem[];
  resumen: ReporteVentasSucursalResumen;
}
