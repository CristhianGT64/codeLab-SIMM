import { useQuery } from "@tanstack/react-query";
import type { HistorialInventarioFilters } from "../../interfaces/Inventario/InventarioInterface";
import { getHistorialInventario } from "../../services/InventoryService";

const useHistorialInventario = (filters: HistorialInventarioFilters = {}) =>
  useQuery({
    queryKey: ["inventario-historial", filters],
    queryFn: () => getHistorialInventario(filters),
  });

export default useHistorialInventario;