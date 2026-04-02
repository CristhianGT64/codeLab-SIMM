import { useQuery } from "@tanstack/react-query";
import { getProductosBajoStock } from "../../services/InventoryService";

const useProductosBajoStock = (sucursalId?: string) =>
  useQuery({
    queryKey: ["inventario-bajo-stock", sucursalId],
    queryFn: () => getProductosBajoStock(sucursalId),
    refetchInterval: 30000,
  });

export default useProductosBajoStock;
