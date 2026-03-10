import { useQuery } from "@tanstack/react-query";
import { listCategoriaPermisos } from "../../services/permissionService";

const useListCategoriaPermisos = () => 
    useQuery({
        queryKey:['permission'],
        queryFn : listCategoriaPermisos
    })


export default useListCategoriaPermisos;