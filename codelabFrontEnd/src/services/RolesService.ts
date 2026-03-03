import type RolResponse from "../interfaces/RolesInterface/RolesInterface";
import settings from "../lib/settings";

export const listRols = async (): Promise<RolResponse> => {
  const response = await fetch(`${settings.URL}/roles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as RolResponse;

  if (!response.ok) {
    throw new Error("No se encontraron usuarios");
  }

  return payload;

};