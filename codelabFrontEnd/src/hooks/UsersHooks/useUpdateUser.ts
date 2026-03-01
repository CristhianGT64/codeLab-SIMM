import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormUserState } from "../../interfaces/Users/FormUserInterface";
import { updateUser } from "../../services/usersService";
import type { booleanResponse } from "../../interfaces/Users/UserInterface";

interface UpdateUserPayload {
  id: string;
  credentials: FormUserState;
}

const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<booleanResponse, Error, UpdateUserPayload>({
    mutationFn: updateUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
    },
  });
};

export default useUpdateUser;
