import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeSucursalStatus } from "../../services/SucursalesService";

const useChangeSucursalStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => changeSucursalStatus(id),
    onMutate: async (id: string) => {
      // En caché, invertimos el estado de la sucursal para una respuesta más rápida.
      await queryClient.cancelQueries(["sucursales"]);
      const previous = queryClient.getQueryData<any>(["sucursales"]);
      if (previous) {
        queryClient.setQueryData(["sucursales"], {
          ...previous,
          data: previous.data.map((s: any) =>
            s.id === id ? { ...s, activa: !s.activa } : s
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
      queryClient.invalidateQueries(["sucursales"]);
    },
  });
};

export default useChangeSucursalStatus;