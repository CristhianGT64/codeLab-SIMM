import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTipoDocumento } from "../../services/TipoDocumentoService";
import type { TipoDocumentoForm } from "../../interfaces/TipodedocumentoInterface/TipoDocumentoInterface";

interface UpdateTipoDocumentoParams {
  id: string;
  body: TipoDocumentoForm;
}

const useUpdateTipoDocumento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: UpdateTipoDocumentoParams) =>
      updateTipoDocumento(id, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tiposDocumento"] });
      queryClient.invalidateQueries({ queryKey: ["tiposDocumento", "activos"] });
      queryClient.invalidateQueries({ queryKey: ["tipoDocumento", variables.id] });
    },
  });
};

export default useUpdateTipoDocumento;