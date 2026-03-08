export interface Permisos {
    id : string;
    nombre : string;
    descripcion : string;
    disponible : string;
    categoriaId : string
}

export interface ResponsePermisos {
    success : boolean,
    data : Permisos[]
}