export interface LibroDiarioFilters {
  fechaInicio?: string;
  fechaFin?: string;
}

export interface LibroDiarioMovimiento {
  id: string;
  uuidDetalle: string;
  asientoId: string;
  subCuentaContableId: string;
  cuentaContableNombre: string;
  cuentaContableCodigo: string;
  montoDebe: number;
  montoHaber: number;
  descripcion: string | null;
  orden: number;
}

export interface LibroDiarioAsiento {
  id: string;
  uuidAsientoContable: string;
  numeroAsiento: string;
  descripcion: string | null;
  tipoOperacion: string;
  idOperacionOrigen: string | null;
  totalDebe: number;
  totalHaber: number;
  balanceado: boolean;
  fecha: string | null;
  detalles: LibroDiarioMovimiento[];
}

export type LibroDiarioDetalle = LibroDiarioAsiento;

export interface LibroDiarioResumen {
  totalAsientos: number;
  totalMovimientos: number;
  totalDebe: number;
  totalHaber: number;
}
