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

export interface FormPermisoSeleccionados {
    permissions : string[]
}

export const permisosSeleccionadosEmpty : FormPermisoSeleccionados = {
    permissions : []
}