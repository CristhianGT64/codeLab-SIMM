import { useQuery } from "@tanstack/react-query";
import type {
  LibroDiarioAsiento,
  LibroDiarioFilters,
} from "../../interfaces/Reportes/LibroDiarioInterface";
import { getLibroDiario } from "../../services/ReportesService";

const useLibroDiario = (
  filters: LibroDiarioFilters,
  enabled = true,
) =>
  useQuery<LibroDiarioAsiento[], Error>({
    queryKey: [
      "reportes",
      "libro-diario",
      filters.fechaInicio ?? "",
      filters.fechaFin ?? "",
    ],
    queryFn: () => getLibroDiario(filters),
    enabled,
  });

export default useLibroDiario;
