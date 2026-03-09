import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRol } from "../../services/RolesService";

const useDeleteRol = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: deleteRol,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roles", variables] });
    },
  });
};

export default useDeleteRol;
