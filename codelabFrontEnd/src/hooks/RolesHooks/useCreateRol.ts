import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { createRol } from "../../services/RolesService";
import type { CreateRolResponse, FormRol } from "../../interfaces/RolesInterface/RolesInterface";

const useCreateRol = () => {
    const queryClient = useQueryClient();

    return useMutation<CreateRolResponse, Error, FormRol>({
        mutationFn: createRol,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:['roles']})
        }
    })
}

export default useCreateRol;