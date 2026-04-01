import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTipoCliente } from "../../services/TipoClienteService";

const useUpdateTipoCliente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTipoCliente,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tipos-cliente"] }),
  });
};

export default useUpdateTipoCliente;
