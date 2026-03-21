import { useQuery } from "@tanstack/react-query";
import { getMetodoInventario } from "../../services/MetodoInventarioService";

const useMetodoInventario = () =>
  useQuery({
    queryKey: ["metodo-inventario"],
    queryFn: getMetodoInventario,
  });

export default useMetodoInventario;