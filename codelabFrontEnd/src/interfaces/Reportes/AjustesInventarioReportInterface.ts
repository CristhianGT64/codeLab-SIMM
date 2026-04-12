export type TipoAjusteInventario = "PERDIDA" | "DETERIORO" | "SOBRANTE";

export interface AjusteInventarioMini {
  id: string;
  nombre: string;
  sku: string;
  unidadMedida: string | null;
}

export interface AjusteInventarioSucursalMini {
  id: string;
  nombre: string;
}

export interface AjusteInventarioUsuarioMini {
  id: string;
  nombreCompleto: string;
  usuario: string;
}

export interface AjusteInventarioReportItem {
  id: string;
  productoId: string;
  producto: AjusteInventarioMini;
  sucursal: AjusteInventarioSucursalMini;
  usuario: AjusteInventarioUsuarioMini | null;
  tipoMovimiento: "entrada" | "salida";
  cantidadAjustada: number;
  tipoAjuste: TipoAjusteInventario;
  tipoAjusteLabel: string;
  fechaAjuste: string;
  costoUnitario: number;
  impactoEconomico: number;
  impactoEconomicoAbsoluto: number;
  detalleMotivo: string | null;
  observaciones: string | null;
  stockResultante: number;
  referenciaTipo: string | null;
}

export interface AjusteInventarioTipoResumen {
  cantidadAjustes: number;
  impactoEconomico: number;
}

export interface AjusteInventarioReportResumen {
  totalRegistros: number;
  totalCantidadAjustada: number;
  impactoTotal: number;
  impactoNegativoTotal: number;
  impactoPositivoTotal: number;
  porTipo: Record<TipoAjusteInventario, AjusteInventarioTipoResumen>;
}

export interface AjusteInventarioReportFilters {
  productoId?: string;
  fechaInicio?: string;
  fechaFin?: string;
  tipoAjuste?: TipoAjusteInventario | "";
}

export interface AjusteInventarioReportResponse {
  items: AjusteInventarioReportItem[];
  resumen: AjusteInventarioReportResumen;
  filtrosAplicados: {
    productoId: string | null;
    fechaInicio: string | null;
    fechaFin: string | null;
    tipoAjuste: TipoAjusteInventario | null;
  };
}
