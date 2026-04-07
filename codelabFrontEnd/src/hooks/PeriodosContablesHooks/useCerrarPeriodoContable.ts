import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cerrarPeriodoContable } from "../../services/PeriodosContablesService";

const useCerrarPeriodoContable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cerrarPeriodoContable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["periodos-contables"] });
      queryClient.invalidateQueries({ queryKey: ["reportes", "libro-diario"] });
      queryClient.invalidateQueries({ queryKey: ["reportes", "libro-mayor"] });
    },
  });
};

export default useCerrarPeriodoContable;
