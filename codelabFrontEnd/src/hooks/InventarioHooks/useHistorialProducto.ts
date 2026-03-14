import { useQuery } from "@tanstack/react-query";
import { getHistorialProducto } from "../../services/InventoryService";

const useHistorialProducto = ({
  productoId,
  sucursalId,
}: {
  productoId: string;
  sucursalId: string;
}) =>
  useQuery({
    queryKey: ["inventario-historial-producto", productoId, sucursalId],
    queryFn: () => getHistorialProducto({ productoId, sucursalId }),
    enabled: !!productoId && !!sucursalId,
  });

export default useHistorialProducto;