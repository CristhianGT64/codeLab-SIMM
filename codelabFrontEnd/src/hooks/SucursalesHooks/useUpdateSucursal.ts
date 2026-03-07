import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSucursal } from "../../services/SucursalesService";

const useUpdateSucursal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSucursal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sucursales"] }),
  });
};

export default useUpdateSucursal;