export interface MetodoInventarioData {
  id: string;
  metodoValuacion: "FIFO" | "PROMEDIO_PONDERADO";
  monedaFuncional: string;
}

export interface MetodoInventarioResponse {
  success: boolean;
  data: MetodoInventarioData;
}

export interface UpdateMetodoInventarioForm {
  metodoValuacion: "FIFO" | "PROMEDIO_PONDERADO";
  monedaFuncional?: string;
}

export interface UpdateMetodoInventarioResponse {
  success: boolean;
  message: string;
  data: MetodoInventarioData;
}

export interface OpcionesMetodoInventarioResponse {
  success: boolean;
  data: Array<"FIFO" | "PROMEDIO_PONDERADO">;
}