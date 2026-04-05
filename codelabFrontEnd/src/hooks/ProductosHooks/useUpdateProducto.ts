import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormProducts } from "../../interfaces/Products/FormProducts";
import { UpdateProduct } from "../../services/ProductService";



const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, {id : string ,credentials : FormProducts}>({
    mutationFn: UpdateProduct,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["inventario-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["inventario-bajo-stock"] });
      queryClient.invalidateQueries({ queryKey: ["inventario-alertas"] });
    },
  });
};

export default useUpdateProduct;
