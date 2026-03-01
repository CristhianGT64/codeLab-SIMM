export interface Sucursal {
    id : string;
    nombre : string
    direccion : string
    telefono : string;
    activa : boolean
}

export default interface SucursalResponse {
      success: boolean;
      data: Sucursal[];
}