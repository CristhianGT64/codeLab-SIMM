import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductStockMinimo } from "../../services/ProductService";

const useUpdateStockMinimo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProductStockMinimo,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["inventario-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["inventario-historial"] });
      queryClient.invalidateQueries({ queryKey: ["inventario-bajo-stock"] });
      queryClient.invalidateQueries({ queryKey: ["inventario-alertas"] });
    },
  });
};

export default useUpdateStockMinimo;
