import type { ResponsePermisos } from "../interfaces/PermisosInterface/PermisosInterface";
import settings from "../lib/settings";

export const listPermisos = async (): Promise<ResponsePermisos> => {
  const response = await fetch(`${settings.URL}/permissions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as ResponsePermisos;

  if (!response.ok) {
    throw new Error("No se encontraron permisos");
  }

  return payload;
};
