import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormProducts } from "../../interfaces/Products/FormProducts";
import { createProduct } from "../../services/ProductService";

const useCreateProducto = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, FormProducts>({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["inventario-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["inventario-bajo-stock"] });
      queryClient.invalidateQueries({ queryKey: ["inventario-alertas"] });
    },
  });
};

export default useCreateProducto;
