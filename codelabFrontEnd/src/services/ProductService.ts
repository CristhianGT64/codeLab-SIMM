import type {
  ProductResponse,
  FormProducts,
} from "../interfaces/Products/FormProducts";
import settings from "../lib/settings";
import type { booleanResponse } from "../interfaces/Users/UserInterface";

export const ListProduct = async (): Promise<ProductResponse> => {
  const response = await fetch(`${settings.URL}/productos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as ProductResponse;

  if (!response.ok) {
    throw new Error("No se encontraron usuarios");
  }

  return payload;
};

export const inactivateProducto = async (
  id: string,
): Promise<booleanResponse> => {
  const response = await fetch(`${settings.URL}/productos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ estado: "inactivo" }),
  });

  const payload = (await response.json()) as booleanResponse;

  return validatePlayload(response, payload);
};

export const activateProducto = async (
  id: string,
): Promise<booleanResponse> => {
  const response = await fetch(`${settings.URL}/productos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ estado: "activo" }),
  });

  const payload = (await response.json()) as booleanResponse;

  return validatePlayload(response, payload);
};

const validatePlayload = (
  response: any,
  payload: booleanResponse,
): booleanResponse => {
  if (!response.ok) {
    throw new Error("No se pudo actualizar el estado");
  }
  if (typeof payload === "boolean") {
    return payload;
  }

  return { success: payload.success };
};

export const createProduct = async (
  credentials: FormProducts,
): Promise<boolean> => {
  const response = await fetch(`${settings.URL}/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const payload = (await response.json()) as { success?: boolean } | boolean;

  if (!response.ok) {
    throw new Error("No se pudo crear el producto");
  }

  if (typeof payload === "boolean") {
    return payload;
  }

  return Boolean(payload?.success);
};
