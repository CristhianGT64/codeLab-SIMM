import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeTipoClienteStatus } from "../../services/TipoClienteService";
import type { TipoClienteResponse } from "../../interfaces/TiposdeCliente/TipoClienteInterface";

const useChangeTipoClienteStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, disponible }: { id: string; disponible: boolean }) =>
      changeTipoClienteStatus(id, disponible),
    onMutate: async ({ id, disponible }) => {
      await queryClient.cancelQueries({ queryKey: ["tipos-cliente"] });
      const previous = queryClient.getQueryData<TipoClienteResponse>([
        "tipos-cliente",
      ]);
      if (previous) {
        queryClient.setQueryData(["tipos-cliente"], {
          ...previous,
          data: previous.data.map((t) =>
            t.id === id ? { ...t, disponible } : t,
          ),
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["tipos-cliente"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tipos-cliente"] });
    },
  });
};

export default useChangeTipoClienteStatus;
