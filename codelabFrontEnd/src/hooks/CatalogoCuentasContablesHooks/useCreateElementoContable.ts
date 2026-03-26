import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createElementoContable } from "../../services/CatalogoCuentasContablesService";

const useCreateElementoContable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createElementoContable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogo-contable"] });
    },
  });
};

export default useCreateElementoContable;