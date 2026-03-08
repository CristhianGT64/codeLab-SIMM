import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { booleanResponse } from "../../interfaces/Users/UserInterface";
import { activateProducto } from "../../services/ProductService";

const useActivateProducto = () => {
  const queryClient = useQueryClient();

  return useMutation<booleanResponse, Error, string>({
    mutationFn: activateProducto,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables] });
    },
  });
};

export default useActivateProducto;
