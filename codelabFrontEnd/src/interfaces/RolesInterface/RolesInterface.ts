export interface Rol {
    id : string;
    nombre : string;
    descripcion : string;
    disponible : boolean;
    createdAt : string | null;
    
}

export default interface RolResponse {
      success: boolean;
      data: Rol[];
}