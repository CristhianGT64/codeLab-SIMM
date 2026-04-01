import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeSucursalStatus } from "../../services/SucursalesService";
import type { SucursalResponse } from "../../interfaces/SucursalInterface";

const useChangeSucursalStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => changeSucursalStatus(id),
    onMutate: async (id: string) => {
      // En caché, invertimos el estado de la sucursal para una respuesta más rápida.
      await queryClient.cancelQueries({ queryKey: ["sucursales"] });
      const previous = queryClient.getQueryData<SucursalResponse>(["sucursales"]);
      if (previous) {
        queryClient.setQueryData(["sucursales"], {
          ...previous,
          data: previous.data.map((s) =>
            s.id === id ? { ...s, activa: !s.activa } : s,
          ),
        });
      }
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["sucursales"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sucursales"] });
    },
  });
};

export default useChangeSucursalStatus;
