import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubCuentaContable } from "../../services/CatalogoCuentasContablesService";

const useCreateSubCuentaContable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubCuentaContable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogo-contable"] });
    },
  });
};

export default useCreateSubCuentaContable;