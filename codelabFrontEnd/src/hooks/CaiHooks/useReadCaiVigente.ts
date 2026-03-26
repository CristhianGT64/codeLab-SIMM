import { useQuery } from "@tanstack/react-query";
import { ObtenerCaiVigente } from "../../services/CaiService";

const useReadCaiVigente = (idCai?: string) =>
  useQuery({
    queryKey: ["caiVigente", idCai ?? "ultimo"],
    queryFn: () => ObtenerCaiVigente(idCai),
  });

export default useReadCaiVigente;
