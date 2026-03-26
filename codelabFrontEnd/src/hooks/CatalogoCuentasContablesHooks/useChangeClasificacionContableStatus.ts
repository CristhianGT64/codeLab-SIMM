import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeClasificacionContableStatus } from "../../services/CatalogoCuentasContablesService";

const useChangeClasificacionContableStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeClasificacionContableStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogo-contable"] });
    },
  });
};

export default useChangeClasificacionContableStatus;