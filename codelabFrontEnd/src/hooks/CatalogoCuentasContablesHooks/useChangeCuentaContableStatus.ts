import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeCuentaContableStatus } from "../../services/CatalogoCuentasContablesService";

const useChangeCuentaContableStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeCuentaContableStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogo-contable"] });
    },
  });
};

export default useChangeCuentaContableStatus;