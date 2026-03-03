import { useQuery } from "@tanstack/react-query";
import { listSucursales } from "../../services/SucursalesService";

const useListSucursales = () =>
  useQuery({
    queryKey: ["sucursales"],
    queryFn: listSucursales,
  });

export default useListSucursales;
