import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSucursal } from "../../services/SucursalesService";

const useCreateSucursal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSucursal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sucursales"] }),
  });
};

export default useCreateSucursal;