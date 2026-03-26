import { useQuery } from "@tanstack/react-query";
import { getNaturalezasContables } from "../../services/CatalogoCuentasContablesService";

const useNaturalezasContables = () =>
  useQuery({
    queryKey: ["catalogo-contable", "naturalezas"],
    queryFn: getNaturalezasContables,
  });

export default useNaturalezasContables;