import { useQuery } from "@tanstack/react-query";
import { getTipoClienteById } from "../../services/TipoClienteService";

const useGetTipoCliente = (id?: string) =>
  useQuery({
    queryKey: ["tipo-cliente", id],
    queryFn: () => getTipoClienteById(id!),
    enabled: !!id,
  });

export default useGetTipoCliente;
