import { useQuery } from "@tanstack/react-query";
import { listPermisos } from "../../services/permissionService";

const useListPermisos = () => {
    useQuery({
        queryKey:['permission'],
        queryFn : listPermisos
    })
}

export default useListPermisos;