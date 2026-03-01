import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inactivateUser } from "../../services/usersService";
import type { booleanResponse } from "../../interfaces/Users/UserInterface";

const useInactiveUser = () => {
  const queryClient = useQueryClient();

  return useMutation<booleanResponse, Error, string>({
    mutationFn: inactivateUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables] });
    },
  });
};

export default useInactiveUser;
