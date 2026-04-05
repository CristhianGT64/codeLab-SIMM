import { useQuery } from "@tanstack/react-query";
import type { ImpuestoConfiguracionResponse } from "../../interfaces/Configuracion/ImpuestoInterface";
import { listImpuestosConfiguracion } from "../../services/ConfiguracionImpuestosService";

const useListImpuestos = () =>
  useQuery<ImpuestoConfiguracionResponse, Error>({
    queryKey: ["configuracion-impuestos"],
    queryFn: listImpuestosConfiguracion,
  });

export default useListImpuestos;
