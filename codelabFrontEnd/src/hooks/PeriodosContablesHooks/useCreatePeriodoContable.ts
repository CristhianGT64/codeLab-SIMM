import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPeriodoContable } from "../../services/PeriodosContablesService";

const useCreatePeriodoContable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPeriodoContable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["periodos-contables"] });
      queryClient.invalidateQueries({ queryKey: ["reportes", "libro-diario"] });
      queryClient.invalidateQueries({ queryKey: ["reportes", "libro-mayor"] });
    },
  });
};

export default useCreatePeriodoContable;
