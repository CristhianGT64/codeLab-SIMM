import settings from "../lib/settings";
import type { ProveedorResponse } from "../interfaces/Proveedores/ProveedorInterface";

export const listProveedores = async (): Promise<ProveedorResponse> => {
  const response = await fetch(`${settings.URL}/proveedores?disponible=true`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as ProveedorResponse;

  if (!response.ok) {
    throw new Error("No se pudieron obtener los proveedores");
  }

  return payload;
};