import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeTipoDocumentoStatus } from "../../services/TipoDocumentoService";

const useChangeTipoDocumentoStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => changeTipoDocumentoStatus(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["tiposDocumento"] });
      queryClient.invalidateQueries({ queryKey: ["tiposDocumento", "activos"] });
      queryClient.invalidateQueries({ queryKey: ["tipoDocumento", id] });
    },
  });
};

export default useChangeTipoDocumentoStatus;