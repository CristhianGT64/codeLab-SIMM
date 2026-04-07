import { useQuery } from "@tanstack/react-query";
import type {
  LibroMayorFilters,
  LibroMayorResponse,
} from "../../interfaces/Reportes/LibroMayorInterface";
import { getLibroMayorReport } from "../../services/ReportesService";

const useLibroMayor = (
  filters: LibroMayorFilters,
  enabled = true,
) =>
  useQuery<LibroMayorResponse, Error>({
    queryKey: [
      "reportes",
      "libro-mayor",
      filters.cuentaId ?? "",
      filters.periodoContable ?? "",
      filters.fechaInicio ?? "",
      filters.fechaFin ?? "",
    ],
    queryFn: () => getLibroMayorReport(filters),
    enabled,
  });

export default useLibroMayor;
