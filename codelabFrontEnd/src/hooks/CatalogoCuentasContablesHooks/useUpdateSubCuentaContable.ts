import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSubCuentaContable } from "../../services/CatalogoCuentasContablesService";

const useUpdateSubCuentaContable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSubCuentaContable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogo-contable"] });
    },
  });
};

export default useUpdateSubCuentaContable;