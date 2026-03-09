import { useQuery } from "@tanstack/react-query";
import { listCategoriaProducto } from "../../services/CategoriaProductoService";
import type { ResponseCategoriaProducto } from "../../interfaces/Products/FormProducts";


const useListCategoriaProducto = () =>
  useQuery<ResponseCategoriaProducto, Error>({
    queryKey: ["categoryProduct"],
    queryFn: listCategoriaProducto,
  });

export default useListCategoriaProducto;
