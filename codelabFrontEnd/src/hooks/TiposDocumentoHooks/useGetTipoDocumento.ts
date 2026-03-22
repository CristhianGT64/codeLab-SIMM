import { useQuery } from "@tanstack/react-query";
import { getTipoDocumentoById } from "../../services/TipoDocumentoService";

const useGetTipoDocumento = (id: string) =>
  useQuery({
    queryKey: ["tipoDocumento", id],
    queryFn: () => getTipoDocumentoById(id),
    enabled: Boolean(id),
  });

export default useGetTipoDocumento;