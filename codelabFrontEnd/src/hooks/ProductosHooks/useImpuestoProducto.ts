import { useQuery } from "@tanstack/react-query";
import { listImpuestosProducto } from "../../services/ImpuestoProductoService";
import type { ResponseImpuestoProducto } from "../../interfaces/Products/FormProducts";

const useListImpuestosProducto = () =>
  useQuery<ResponseImpuestoProducto, Error>({
    queryKey: ["impuestosProduct"],
    queryFn: listImpuestosProducto,
  });

export default useListImpuestosProducto;
