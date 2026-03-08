import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { booleanResponse } from "../../interfaces/Users/UserInterface";
import { inactivateProducto } from "../../services/ProductService";

const useInactiveProducto = () => {
  const queryClient = useQueryClient();

  return useMutation<booleanResponse, Error, string>({
    mutationFn: inactivateProducto,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables] });
    },
  });
};

export default useInactiveProducto;
