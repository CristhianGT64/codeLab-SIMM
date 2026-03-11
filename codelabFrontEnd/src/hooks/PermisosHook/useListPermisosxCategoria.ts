import { useQuery } from "@tanstack/react-query"
import { listPermisosxCategoria } from "../../services/permissionService"


const useListPermisosxCategoria = () => 
    useQuery({
        queryKey:['PermissionXCategory'],
        queryFn: listPermisosxCategoria
    })


export default useListPermisosxCategoria;