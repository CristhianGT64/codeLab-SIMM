import { useQuery } from "@tanstack/react-query";
import { listTiposDocumentoActivos } from "../../services/TipoDocumentoService";

const useListTiposDocumentoActivos = () =>
  useQuery({
    queryKey: ["tiposDocumento", "activos"],
    queryFn: listTiposDocumentoActivos,
  });

export default useListTiposDocumentoActivos;