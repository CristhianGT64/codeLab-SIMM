import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCuentaContable } from "../../services/CatalogoCuentasContablesService";

const useCreateCuentaContable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCuentaContable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogo-contable"] });
    },
  });
};

export default useCreateCuentaContable;