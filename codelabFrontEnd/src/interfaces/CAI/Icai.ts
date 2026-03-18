export interface Icai {
    id_cai : string;
    codigo : string;
    fechaInicio : string;
    fechaFin : string;
    activo : string;
    rangoEmision : IrangoEmision
}

export interface IrangoEmision {
    id_rango_emision : string;
    inicio_rango : string;
    final_rango : string;
    id_cai : string
}

export interface ResponseCaiVigente {
    success : boolean;
    data : Icai
}