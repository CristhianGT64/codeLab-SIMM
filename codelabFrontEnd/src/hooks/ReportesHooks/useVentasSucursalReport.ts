import { useQuery } from "@tanstack/react-query";
import type {
  ReporteVentasSucursalFilters,
  ReporteVentasSucursalResponse,
} from "../../interfaces/Reportes/VentasSucursalReportInterface";
import { getVentasSucursalReport } from "../../services/ReportesService";

const useVentasSucursalReport = (
  filters: ReporteVentasSucursalFilters,
  enabled = true,
) =>
  useQuery<ReporteVentasSucursalResponse, Error>({
    queryKey: [
      "reportes",
      "ventas-sucursales",
      filters.fechaInicio ?? "",
      filters.fechaFin ?? "",
      [...(filters.sucursalIds ?? [])].sort().join(","),
    ],
    queryFn: () => getVentasSucursalReport(filters),
    enabled,
  });

export default useVentasSucursalReport;
