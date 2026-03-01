import type SucursalResponse from "../interfaces/SucursaleInterface/SucursalesInterface";
import settings from "../lib/settings";

export const listSucursales = async (): Promise<SucursalResponse> => {
  const response = await fetch(`${settings.URL}/sucursales`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as SucursalResponse;

  if (!response.ok) {
    throw new Error("No se encontraron usuarios");
  }

  return payload;

};