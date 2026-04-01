import { useQuery } from "@tanstack/react-query";
import { listVentas } from "../../services/PosService";
import type { VentaHistorialItem } from "../../interfaces/POS/IVentasHistorial";

interface UseVentasHistoryOptions {
  usuarioId?: string;
  enabled?: boolean;
}

const useVentasHistory = ({
  usuarioId,
  enabled = true,
}: UseVentasHistoryOptions = {}) =>
  useQuery<VentaHistorialItem[], Error>({
    queryKey: ["ventas", usuarioId ?? "all"],
    queryFn: () => listVentas(usuarioId),
    enabled,
  });

export default useVentasHistory;
