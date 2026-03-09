import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormPermission } from "../../interfaces/PermisosInterface/categoriaPermisos";
import { createPermission } from "../../services/permissionService";

const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, FormPermission>({
    mutationFn: createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permission"] });
    },
  });
};

export default useCreatePermission;