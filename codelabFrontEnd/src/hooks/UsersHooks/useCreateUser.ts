import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormUserState } from "../../interfaces/Users/FormUserInterface";
import { createUser } from "../../services/usersService";

const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, FormUserState>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export default useCreateUser;
