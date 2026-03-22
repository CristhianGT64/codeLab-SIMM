import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTipoDocumento } from "../../services/TipoDocumentoService";

const useCreateTipoDocumento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTipoDocumento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiposDocumento"] });
      queryClient.invalidateQueries({ queryKey: ["tiposDocumento", "activos"] });
    },
  });
};

export default useCreateTipoDocumento;