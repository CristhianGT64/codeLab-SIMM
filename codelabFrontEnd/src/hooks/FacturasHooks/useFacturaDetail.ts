import { useQuery } from "@tanstack/react-query";
import type { FacturaHistorialDetail } from "../../interfaces/Facturas/IFacturasHistorial";
import { getFacturaByNumero } from "../../services/FacturaService";

const useFacturaDetail = (numeroFactura: string | null, enabled = true) =>
  useQuery<FacturaHistorialDetail, Error>({
    queryKey: ["factura", numeroFactura],
    queryFn: () => getFacturaByNumero(numeroFactura ?? ""),
    enabled: enabled && Boolean(numeroFactura),
  });

export default useFacturaDetail;
