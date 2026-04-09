import { useQuery } from "@tanstack/react-query";
import type {
  AjusteInventarioReportFilters,
  AjusteInventarioReportResponse,
} from "../../interfaces/Reportes/AjustesInventarioReportInterface";
import { getAjustesInventarioReport } from "../../services/ReportesService";

const useAjustesInventarioReport = (
  filters: AjusteInventarioReportFilters,
  enabled = true,
) =>
  useQuery<AjusteInventarioReportResponse, Error>({
    queryKey: [
      "reportes",
      "ajustes-inventario",
      filters.productoId ?? "",
      filters.fechaInicio ?? "",
      filters.fechaFin ?? "",
      filters.tipoAjuste ?? "",
    ],
    queryFn: () => getAjustesInventarioReport(filters),
    enabled,
  });

export default useAjustesInventarioReport;
