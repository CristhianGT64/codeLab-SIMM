import { useQuery } from "@tanstack/react-query";
import { getVentaById } from "../../services/PosService";
import type { VentaDetalle } from "../../interfaces/POS/IVentasHistorial";

const useVentaDetail = (id: string | null, enabled = true) =>
  useQuery<VentaDetalle, Error>({
    queryKey: ["venta", id],
    queryFn: () => getVentaById(id ?? ""),
    enabled: enabled && Boolean(id),
  });

export default useVentaDetail;
