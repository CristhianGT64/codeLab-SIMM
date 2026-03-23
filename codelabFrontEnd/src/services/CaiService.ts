import type {
  FormNuevoCai,
  ResponseCaiVigente,
  ResponseListarCais,
} from "../interfaces/CAI/Icai";
import settings from "../lib/settings";

const extractCaiList = (payload: unknown): ResponseListarCais => {
  if (Array.isArray(payload)) {
    return {
      success: true,
      data: payload,
    };
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    const responsePayload = payload as {
      success?: boolean;
      data: ResponseListarCais["data"];
    };

    return {
      success: responsePayload.success ?? true,
      data: responsePayload.data,
    };
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    (payload as { data?: unknown }).data &&
    typeof (payload as { data?: unknown }).data === "object" &&
    Array.isArray(((payload as { data?: { data?: unknown } }).data)?.data)
  ) {
    const nestedPayload = payload as {
      success?: boolean;
      data: { data: ResponseListarCais["data"] };
    };

    return {
      success: nestedPayload.success ?? true,
      data: nestedPayload.data.data,
    };
  }

  return {
    success: false,
    data: [],
  };
};

export const ObtenerCaiVigente = async (
  idCai?: string,
): Promise<ResponseCaiVigente> => {
  const params = new URLSearchParams();

  if (idCai) {
    params.set("id_cai", idCai);
  }

  const queryString = params.toString();
  const endpoint = `${settings.URL}/cai/${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(endpoint, {
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
  const response = await fetch(`${settings.URL}/cai/lista`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const rawPayload = (await response.json()) as unknown;

  if (!response.ok) {
    throw new Error("No se encontraron los CAI emitidos");
  }

  return extractCaiList(rawPayload);
};

export const createCategoriaPermission = async (
  credentials: FormNuevoCai,
): Promise<boolean> => {
  const response = await fetch(`${settings.URL}/cai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const payload = (await response.json()) as boolean;

  if (!response.ok) {
    throw new Error("No se pudo crear el CAI");
  }

  return payload;
};
