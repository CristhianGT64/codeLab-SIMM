export interface Rol {
    id : string;
    nombre : string;
    descripcion : string;
    disponible : boolean;
    createdAt : string | null;
    totalUsuariosRol : number;
    totalPermisosRol : number;
}

export default interface RolResponse {
      success: boolean;
      data: Rol[];
}