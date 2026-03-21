import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateMetodoInventarioForm } from "../../interfaces/Configuracion/MetodoInventarioInterface";
import { updateMetodoInventario } from "../../services/MetodoInventarioService";

const useUpdateMetodoInventario = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, UpdateMetodoInventarioForm>({
    mutationFn: updateMetodoInventario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metodo-inventario"] });
    },
  });
};

export default useUpdateMetodoInventario;