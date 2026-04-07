import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePeriodoContable } from "../../services/PeriodosContablesService";

const useUpdatePeriodoContable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePeriodoContable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["periodos-contables"] });
      queryClient.invalidateQueries({ queryKey: ["reportes", "libro-diario"] });
      queryClient.invalidateQueries({ queryKey: ["reportes", "libro-mayor"] });
    },
  });
};

export default useUpdatePeriodoContable;
