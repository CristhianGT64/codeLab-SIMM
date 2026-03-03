export interface Rol {
    id : string;
    nombre : string
    descripcion : string
    disponible : boolean
}

export default interface RolResponse {
      success: boolean;
      data: Rol[];
}