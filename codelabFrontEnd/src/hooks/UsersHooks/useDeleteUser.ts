import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../../services/usersService";
import type { booleanResponse } from "../../interfaces/Users/UserInterface";

const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<booleanResponse, Error, string>({
    mutationFn: deleteUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables] });
    },
  });
};

export default useDeleteUser;
