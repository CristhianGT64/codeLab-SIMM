import { useQuery } from "@tanstack/react-query";
import { getDashboardInventario } from "../../services/InventoryService";

const useDashboardInventario = (sucursalId?: string) =>
  useQuery({
    queryKey: ["inventario-dashboard", sucursalId],
    queryFn: () => getDashboardInventario(sucursalId),
    refetchInterval: 30000,
  });

export default useDashboardInventario;
