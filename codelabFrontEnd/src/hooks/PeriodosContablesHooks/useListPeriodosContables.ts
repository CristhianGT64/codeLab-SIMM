import { useQuery } from "@tanstack/react-query";
import type { PeriodoContableListResponse } from "../../interfaces/PeriodosContables/PeriodoContableInterface";
import { listPeriodosContables } from "../../services/PeriodosContablesService";

const useListPeriodosContables = () =>
  useQuery<PeriodoContableListResponse, Error>({
    queryKey: ["periodos-contables"],
    queryFn: listPeriodosContables,
  });

export default useListPeriodosContables;
