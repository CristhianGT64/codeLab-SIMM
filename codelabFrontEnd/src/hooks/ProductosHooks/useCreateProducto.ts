import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormProducts } from "../../interfaces/Products/FormProducts";
import { createProduct } from "../../services/ProductService";

const useCreateProducto = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, FormProducts>({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });
};

export default useCreateProducto;
