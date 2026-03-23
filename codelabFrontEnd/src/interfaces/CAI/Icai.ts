export interface Icai {
  id_cai: string;
  codigo: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
  tipoDocumentoId?: string;
  tipoDocumento?: ItipoDocumento;
  rangoEmision: IrangoEmision;
  ultimaFacturaEmitida: IultimaFacturaEmitida | null;
  rangoFormateado: string | null;
  cantidadFacturasEmitidas: number;
  disponible?: boolean;
}

export interface IrangoEmision {
  id_rango_emision: string;
  inicio_rango: string;
  final_rango: string;
  id_cai: string;
}

export interface ItipoDocumento {
  id_tipo_documento: string;
  numero: number;
  nombre: string;
  disponible: boolean;
}

export interface IultimaFacturaEmitida {
  id: string;
  correlativo: number;
  numeroFormateado: string;
}

export interface ResponseCaiVigente {
  success: boolean;
  data: Icai;
}

export interface ResponseListarCais {
  success: boolean;
  data: Icai[];
}

export const caiEmpty: Icai = {
  id_cai: "",
  codigo: "",
  fechaInicio: "",
  fechaFin: "",
  activo: false,
  rangoEmision: {
    id_rango_emision: "",
    inicio_rango: "",
    final_rango: "",
    id_cai: "",
  },
  ultimaFacturaEmitida: null,
  rangoFormateado: null,
  cantidadFacturasEmitidas: 0,
};

export interface FormNuevoCai {
  codigo: string;
  fechaInicio: Date;
  fechaFin: Date;
  inicioRango: string;
  finalRango: string;
}

export const formNuevoCaiEmpty: FormNuevoCai = {
  codigo: "",
  fechaInicio: new Date(),
  fechaFin: new Date(),
  inicioRango: "",
  finalRango: "",
};
