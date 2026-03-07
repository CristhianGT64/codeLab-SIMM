import { useQuery } from "@tanstack/react-query";
import { listUnidadesProducto } from "../../services/UnidadesProductosService";


const useListUnidadesProducto = () =>
  useQuery({
    queryKey: ["unitsProduct"],
    queryFn: listUnidadesProducto,
  });

export default useListUnidadesProducto;
