import { useQuery } from "@tanstack/react-query";
import { getDashboardInventario } from "../../services/InventoryService";

const useDashboardInventario = () =>
  useQuery({
    queryKey: ["inventario-dashboard"],
    queryFn: getDashboardInventario,
  });

export default useDashboardInventario;