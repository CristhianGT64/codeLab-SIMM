export interface Icai {
  id_cai: string;
  codigo: string;
  fechaInicio: string;
  fechaFin: string;
  activo: string;
  rangoEmision: IrangoEmision;
  cantidadFacturasEmitidas: number;
}

export interface IrangoEmision {
  id_rango_emision: string;
  inicio_rango: string;
  final_rango: string;
  id_cai: string;
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
  activo: "",
  rangoEmision: {
    id_rango_emision: "",
    inicio_rango: "",
    final_rango: "",
    id_cai: "",
  },
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
