import type {
  ResponseCaiVigente,
  ResponseListarCais,
} from "../interfaces/CAI/Icai";
import settings from "../lib/settings";

export const ObtenerCaiVigente = async (): Promise<ResponseCaiVigente> => {
  const response = await fetch(`${settings.URL}/cai/vigente/ultimo`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as ResponseCaiVigente;

  if (!response.ok) {
    throw new Error("No se encontro el CAI vigente");
  }

  return payload;
};

export const ListarCaiEmitidos = async (): Promise<ResponseListarCais> => {
  const response = await fetch(`${settings.URL}/cai`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as ResponseListarCais;

  if (!response.ok) {
    throw new Error("No se encontraron los CAI emitidos");
  }

  return payload;
};
