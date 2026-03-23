import settings from "../lib/settings";
import type {
  MetodoInventarioResponse,
  OpcionesMetodoInventarioResponse,
  UpdateMetodoInventarioForm,
  UpdateMetodoInventarioResponse,
} from "../interfaces/Configuracion/MetodoInventarioInterface";

const getErrorMessageFromPayload = (payload: unknown, fallback: string) => {
  if (!payload || typeof payload !== "object") return fallback;

  const withMessage = payload as {
    message?: string;
    error?: {
      message?: string;
    };
  };

  return withMessage.error?.message ?? withMessage.message ?? fallback;
};

export const getMetodoInventario =
  async (): Promise<MetodoInventarioResponse> => {
    const response = await fetch(`${settings.URL}/configuracion/metodo-inventario`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const payload = (await response.json()) as MetodoInventarioResponse;

    if (!response.ok) {
      throw new Error("No se pudo obtener el método de inventario");
    }

    return payload;
  };

export const getOpcionesMetodoInventario =
  async (): Promise<OpcionesMetodoInventarioResponse> => {
    const response = await fetch(
      `${settings.URL}/configuracion/metodo-inventario/opciones`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const payload = (await response.json()) as OpcionesMetodoInventarioResponse;

    if (!response.ok) {
      throw new Error("No se pudieron obtener las opciones del método de inventario");
    }

    return payload;
  };

export const updateMetodoInventario = async (
  credentials: UpdateMetodoInventarioForm,
): Promise<boolean> => {
  const response = await fetch(`${settings.URL}/configuracion/metodo-inventario`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  let payload: UpdateMetodoInventarioResponse | { success?: boolean } | null = null;

  try {
    payload =
      (await response.json()) as UpdateMetodoInventarioResponse | { success?: boolean };
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(
      getErrorMessageFromPayload(
        payload,
        "No se pudo actualizar el método de inventario",
      ),
    );
  }

  return Boolean(payload?.success);
};