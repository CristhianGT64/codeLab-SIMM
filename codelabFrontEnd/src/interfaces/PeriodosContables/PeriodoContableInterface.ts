export type PeriodoContableEstado = "ABIERTO" | "CERRADO";
export type TipoPeriodoContable = "MENSUAL" | "ANUAL" | "PERSONALIZADO";

export interface PeriodoContable {
  id: string;
  sucursalId: string;
  sucursalNombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: PeriodoContableEstado;
  fechaCierre: string | null;
  usuarioCierreId: string | null;
  usuarioCierreNombre: string | null;
  activo: boolean;
  tipo: TipoPeriodoContable;
  periodoClave: string;
}

export interface PeriodoContableFormData {
  id?: string;
  sucursalId: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface PeriodoContableResponse {
  success: boolean;
  data: PeriodoContable;
  message?: string;
}

export interface PeriodoContableListResponse {
  success: boolean;
  data: PeriodoContable[];
  message?: string;
}
