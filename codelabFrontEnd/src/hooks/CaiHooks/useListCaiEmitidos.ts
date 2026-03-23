import { useQuery } from "@tanstack/react-query";
import { ListarCaiEmitidos } from "../../services/CaiService";

const useListCaiEmitidos = () =>
  useQuery({
    queryKey: ["caiEmitidos"],
    queryFn: ListarCaiEmitidos,
  });
export default useListCaiEmitidos;
