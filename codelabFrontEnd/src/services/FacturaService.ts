import settings from "../lib/settings";
import type { FacturaRequest, FacturaResponse } from "../interfaces/POS/IFactura";

export const createFactura = async (
  request: FacturaRequest
): Promise<FacturaResponse> => {
  const response = await fetch(`${settings.URL}/facturas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const payload = (await response.json()) as FacturaResponse;

  if (!response.ok) {
    throw new Error("No se pudo generar la factura");
  }

  return payload;
};
