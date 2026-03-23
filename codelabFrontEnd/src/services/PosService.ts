import settings from "../lib/settings";
import type { SaleRequest, SaleResponse } from "../interfaces/POS/IPos";

export const createVenta = async (
  request: SaleRequest
): Promise<SaleResponse> => {
  const response = await fetch(`${settings.URL}/ventas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const payload = (await response.json()) as SaleResponse;

  if (!response.ok) {
    throw new Error("No se pudo registrar la venta");
  }

  return payload;
};
