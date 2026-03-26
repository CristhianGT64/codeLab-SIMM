import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeSubCuentaContableStatus } from "../../services/CatalogoCuentasContablesService";

const useChangeSubCuentaContableStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeSubCuentaContableStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogo-contable"] });
    },
  });
};

export default useChangeSubCuentaContableStatus;