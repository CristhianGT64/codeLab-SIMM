export interface LibroMayorFilters {
  cuentaId?: string;
  periodoContable?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface LibroMayorMovimiento {
  id: string;
  fecha: string | null;
  descripcion: string | null;
  debito: number;
  credito: number;
  saldoAcumulado: number;
  referencia: string | null;
  asientoId: string | null;
  numeroAsiento: string | null;
  orden: number;
}

export interface LibroMayorCuenta {
  cuentaId: string;
  cuentaCodigo: string;
  cuentaNombre: string;
  naturaleza: string | null;
  saldoInicial: number;
  saldoFinal: number;
  totalDebito: number;
  totalCredito: number;
  movimientos: LibroMayorMovimiento[];
}

export interface LibroMayorResumen {
  totalCuentas: number;
  totalMovimientos: number;
  totalDebito: number;
  totalCredito: number;
  saldoGlobal: number;
}

export interface LibroMayorResponse {
  cuentas: LibroMayorCuenta[];
  resumen: LibroMayorResumen;
  periodosDisponibles: string[];
}
