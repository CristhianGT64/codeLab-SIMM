import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClasificacionContable } from "../../services/CatalogoCuentasContablesService";

const useUpdateClasificacionContable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClasificacionContable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogo-contable"] });
    },
  });
};

export default useUpdateClasificacionContable;