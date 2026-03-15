import { useQuery } from "@tanstack/react-query";
import { listProveedores } from "../../services/ProveedorService";

const useListProveedores = () =>
  useQuery({
    queryKey: ["proveedores"],
    queryFn: listProveedores,
  });

export default useListProveedores;