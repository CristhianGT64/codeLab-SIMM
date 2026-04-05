import { useQuery } from "@tanstack/react-query";
import type { FacturaHistorialFilters, FacturaHistorialItem } from "../../interfaces/Facturas/IFacturasHistorial";
import { listFacturas } from "../../services/FacturaService";

const useFacturasHistory = (
  filters: FacturaHistorialFilters,
  enabled = true,
) =>
  useQuery<FacturaHistorialItem[], Error>({
    queryKey: [
      "facturas",
      filters.usuarioId ?? "",
      filters.clienteId ?? "",
      filters.sucursalId ?? "",
      filters.fechaInicio ?? "",
      filters.fechaFin ?? "",
    ],
    queryFn: () => listFacturas(filters),
    enabled,
  });

export default useFacturasHistory;
