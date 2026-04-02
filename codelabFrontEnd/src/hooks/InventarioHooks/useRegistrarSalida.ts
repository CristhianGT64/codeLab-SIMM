import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RegistrarSalidaForm } from "../../interfaces/Inventario/InventarioInterface";
import { registrarSalida } from "../../services/InventoryService";

const useRegistrarSalida = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, RegistrarSalidaForm>({
    mutationFn: registrarSalida,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventario-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["inventario-historial"] });
      queryClient.invalidateQueries({ queryKey: ["inventario-bajo-stock"] });
      queryClient.invalidateQueries({ queryKey: ["inventario-alertas"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });
};

export default useRegistrarSalida;
