import type { ResponseImpuestoProducto } from "../interfaces/Products/FormProducts";
import { listImpuestosAsProductOptions } from "./ConfiguracionImpuestosService";

export const listImpuestosProducto =
  async (): Promise<ResponseImpuestoProducto> => {
    return listImpuestosAsProductOptions();
  };
