import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RegistrarEntradaForm } from "../../interfaces/Inventario/InventarioInterface";
import { registrarEntrada } from "../../services/InventoryService";

const useRegistrarEntrada = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, RegistrarEntradaForm>({
    mutationFn: registrarEntrada,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventario-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["inventario-historial"] });
      queryClient.invalidateQueries({ queryKey: ["inventario-bajo-stock"] });
      queryClient.invalidateQueries({ queryKey: ["inventario-alertas"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });
};

export default useRegistrarEntrada;
