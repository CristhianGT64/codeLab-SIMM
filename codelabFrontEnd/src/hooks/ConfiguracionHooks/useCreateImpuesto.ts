import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createImpuestoConfiguracion } from "../../services/ConfiguracionImpuestosService";

const useCreateImpuesto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createImpuestoConfiguracion,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["configuracion-impuestos"] }),
        queryClient.invalidateQueries({ queryKey: ["impuestosProduct"] }),
      ]);
    },
  });
};

export default useCreateImpuesto;
