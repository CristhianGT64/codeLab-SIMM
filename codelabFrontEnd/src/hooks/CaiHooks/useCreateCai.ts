import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormNuevoCai } from "../../interfaces/CAI/Icai";
import { createCategoriaPermission } from "../../services/CaiService";

const useCreateCai = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, FormNuevoCai>({
    mutationFn: (credentials: FormNuevoCai) =>
      createCategoriaPermission(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caiVigente"] });
      queryClient.invalidateQueries({ queryKey: ["caiEmitidos"] });
    },
  });
};

export default useCreateCai;
