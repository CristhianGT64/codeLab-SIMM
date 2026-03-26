import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateElementoContable } from "../../services/CatalogoCuentasContablesService";

const useUpdateElementoContable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateElementoContable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogo-contable"] });
    },
  });
};

export default useUpdateElementoContable;