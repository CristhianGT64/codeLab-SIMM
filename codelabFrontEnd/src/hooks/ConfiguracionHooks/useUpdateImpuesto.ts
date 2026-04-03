import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateImpuestoConfiguracion } from "../../services/ConfiguracionImpuestosService";

const useUpdateImpuesto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateImpuestoConfiguracion,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["configuracion-impuestos"] }),
        queryClient.invalidateQueries({ queryKey: ["impuestosProduct"] }),
      ]);
    },
  });
};

export default useUpdateImpuesto;
