import { useQuery } from "@tanstack/react-query";
import { getTiposEntrada } from "../../services/InventoryService";

const useTiposEntrada = () =>
  useQuery({
    queryKey: ["inventario-tipos-entrada"],
    queryFn: getTiposEntrada,
  });

export default useTiposEntrada;