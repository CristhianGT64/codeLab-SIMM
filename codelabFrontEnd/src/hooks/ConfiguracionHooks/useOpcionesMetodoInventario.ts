import { useQuery } from "@tanstack/react-query";
import { getOpcionesMetodoInventario } from "../../services/MetodoInventarioService";

const useOpcionesMetodoInventario = () =>
  useQuery({
    queryKey: ["opciones-metodo-inventario"],
    queryFn: getOpcionesMetodoInventario,
  });

export default useOpcionesMetodoInventario;