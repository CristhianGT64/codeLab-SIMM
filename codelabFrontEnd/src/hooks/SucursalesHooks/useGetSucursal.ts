import { useQuery } from "@tanstack/react-query";
import { getSucursalById } from "../../services/SucursalesService";

const useGetSucursal = (id?: string) =>
  useQuery({
    queryKey: ["sucursal", id],
    queryFn: () => getSucursalById(id!),
    enabled: !!id,
  });

export default useGetSucursal;