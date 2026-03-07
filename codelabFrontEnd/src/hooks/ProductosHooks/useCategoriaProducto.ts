import { useQuery } from "@tanstack/react-query";
import { listCategoriaProducto } from "../../services/categoriaProductoService";


const useListCategoriaProducto = () =>
  useQuery({
    queryKey: ["categoryProduct"],
    queryFn: listCategoriaProducto,
  });

export default useListCategoriaProducto;
