import type { ResponseImpuestoProducto } from "../interfaces/Products/FormProducts";
import settings from "../lib/settings";

export const listImpuestosProducto =
  async (): Promise<ResponseImpuestoProducto> => {
    const response = await fetch(`${settings.URL}/impuestos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const payload = (await response.json()) as ResponseImpuestoProducto;

    if (!response.ok) {
      throw new Error("No se encontraron los impuestos");
    }

    return payload;
  };
