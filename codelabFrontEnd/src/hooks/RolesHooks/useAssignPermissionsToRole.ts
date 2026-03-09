import { useMutation } from "@tanstack/react-query";
import { assignPermissionsToRole } from "../../services/RolesService";

interface AssignPermissionsParams {
  roleId: string;
  permissions: string[];
}

const useAssignPermissionsToRole = () =>
  useMutation<boolean, Error, AssignPermissionsParams>({
    mutationFn: ({ roleId, permissions }) =>
      assignPermissionsToRole(roleId, { permissions }),
  });

export default useAssignPermissionsToRole;
