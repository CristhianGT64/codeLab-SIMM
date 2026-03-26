import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClasificacionContable } from "../../services/CatalogoCuentasContablesService";

const useCreateClasificacionContable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClasificacionContable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogo-contable"] });
    },
  });
};

export default useCreateClasificacionContable;