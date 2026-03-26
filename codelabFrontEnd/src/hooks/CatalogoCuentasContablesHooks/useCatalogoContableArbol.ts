import { useQuery } from "@tanstack/react-query";
import { getCatalogoContableArbol } from "../../services/CatalogoCuentasContablesService";

const useCatalogoContableArbol = () =>
  useQuery({
    queryKey: ["catalogo-contable", "arbol"],
    queryFn: getCatalogoContableArbol,
  });

export default useCatalogoContableArbol;