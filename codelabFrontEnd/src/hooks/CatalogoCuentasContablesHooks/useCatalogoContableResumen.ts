import { useQuery } from "@tanstack/react-query";
import { getCatalogoContableResumen } from "../../services/CatalogoCuentasContablesService";

const useCatalogoContableResumen = () =>
  useQuery({
    queryKey: ["catalogo-contable", "resumen"],
    queryFn: getCatalogoContableResumen,
  });

export default useCatalogoContableResumen;