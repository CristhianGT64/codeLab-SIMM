import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTipoCliente } from "../../services/TipoClienteService";

const useCreateTipoCliente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTipoCliente,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tipos-cliente"] }),
  });
};

export default useCreateTipoCliente;
