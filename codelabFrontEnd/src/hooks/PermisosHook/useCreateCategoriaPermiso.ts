import { useMutation } from "@tanstack/react-query"
import type { CreateCategoriaPermission, ResponseCategoryPermission } from "../../interfaces/PermisosInterface/categoriaPermisos"
import { createCategoriaPermission } from "../../services/permissionService"

const useCreateCategoriaPermiso = () => {
    return useMutation<ResponseCategoryPermission, Error, CreateCategoriaPermission>({
        mutationFn: createCategoriaPermission
    })
}

export default useCreateCategoriaPermiso;