import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCuentaContable } from "../../services/CatalogoCuentasContablesService";

const useUpdateCuentaContable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCuentaContable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogo-contable"] });
    },
  });
};

export default useUpdateCuentaContable;