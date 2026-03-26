import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeElementoContableStatus } from "../../services/CatalogoCuentasContablesService";

const useChangeElementoContableStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeElementoContableStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogo-contable"] });
    },
  });
};

export default useChangeElementoContableStatus;