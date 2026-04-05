export interface ImpuestoConfiguracion {
  id: string;
  nombre: string;
  porcentaje: number;
  tasa: number;
  activo: boolean;
}

export interface SaveImpuestoConfiguracionPayload {
  nombre: string;
  porcentaje: number;
}

export interface UpdateImpuestoConfiguracionPayload
  extends SaveImpuestoConfiguracionPayload {
  id: string;
}

export interface ImpuestoConfiguracionResponse {
  success: boolean;
  data: ImpuestoConfiguracion[];
  message?: string;
}

export interface ImpuestoConfiguracionSingleResponse {
  success: boolean;
  data: ImpuestoConfiguracion;
  message?: string;
}
