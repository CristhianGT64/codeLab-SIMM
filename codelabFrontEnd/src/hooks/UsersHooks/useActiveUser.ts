import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateUser } from "../../services/usersService";
import type { booleanResponse } from "../../interfaces/Users/UserInterface";

const useActiveUser = () => {
  const queryClient = useQueryClient();

  return useMutation<booleanResponse, Error, string>({
    mutationFn: activateUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables] });
    },
  });
};

export default useActiveUser;
