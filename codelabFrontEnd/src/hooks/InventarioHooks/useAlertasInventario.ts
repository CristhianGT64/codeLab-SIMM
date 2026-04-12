import { useQuery } from "@tanstack/react-query";
import { getAlertasInventario } from "../../services/InventoryService";

const useAlertasInventario = (sucursalId?: string) =>
  useQuery({
    queryKey: ["inventario-alertas", sucursalId],
    queryFn: () => getAlertasInventario(sucursalId),
    refetchInterval: 30000,
  });

export default useAlertasInventario;
