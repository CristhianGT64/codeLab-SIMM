import { useQuery } from "@tanstack/react-query";
import { getMotivosSalida } from "../../services/InventoryService";

const useMotivosSalida = () =>
  useQuery({
    queryKey: ["inventario-motivos-salida"],
    queryFn: getMotivosSalida,
  });

export default useMotivosSalida;