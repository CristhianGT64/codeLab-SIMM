import { useQuery } from "@tanstack/react-query";
import { listTiposDocumento } from "../../services/TipoDocumentoService";

const useListTiposDocumento = () =>
  useQuery({
    queryKey: ["tiposDocumento"],
    queryFn: listTiposDocumento,
  });

export default useListTiposDocumento;