import { useQuery } from "@tanstack/react-query";
import { listTiposCliente } from "../../services/TipoClienteService";

const useListTiposCliente = () =>
  useQuery({
    queryKey: ["tipos-cliente"],
    queryFn: () => listTiposCliente(),
  });

export default useListTiposCliente;
