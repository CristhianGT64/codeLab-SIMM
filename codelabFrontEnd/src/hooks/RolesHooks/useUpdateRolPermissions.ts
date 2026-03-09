import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRolPermissions } from "../../services/RolesService";

interface UpdatePermissionsParams {
  roleId: string;
  permissions: string[];
}

const useUpdateRolPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, UpdatePermissionsParams>({
    mutationFn: ({ roleId, permissions }) =>
      updateRolPermissions(roleId, { permissions }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rol", variables.roleId] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export default useUpdateRolPermissions;
