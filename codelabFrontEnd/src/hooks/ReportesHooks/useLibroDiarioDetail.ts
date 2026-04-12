import { useQuery } from "@tanstack/react-query";
import type { LibroDiarioDetalle } from "../../interfaces/Reportes/LibroDiarioInterface";
import { getLibroDiarioDetalle } from "../../services/ReportesService";

const useLibroDiarioDetail = (asientoId: string | null, enabled = true) =>
  useQuery<LibroDiarioDetalle, Error>({
    queryKey: ["reportes", "libro-diario", "detalle", asientoId],
    queryFn: () => getLibroDiarioDetalle(asientoId ?? ""),
    enabled: enabled && Boolean(asientoId),
  });

export default useLibroDiarioDetail;
