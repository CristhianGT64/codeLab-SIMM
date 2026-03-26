import type {
  ProductResponse,
  FormProducts,
  ProductReadResponse,
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
  const formData = new FormData();

  formData.append("nombre", credentials.nombre);
  formData.append("sku", credentials.sku);
  formData.append("categoriaId", credentials.categoriaId);
  formData.append("impuestoId", credentials.impuestoId);
  formData.append("costo", credentials.costo);
  formData.append("precioVenta", String(credentials.precioVenta));
  formData.append("unidadMedida", credentials.unidadMedida);
  formData.append("stockInicial", String(credentials.stockInicial));
  formData.append("sucursalId", credentials.sucursalId);

  if (credentials.imagen) {
    formData.append("imagen", credentials.imagen);
  }

  const response = await fetch(`${settings.URL}/productos`, {
    method: "POST",
    body: formData,
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

export const UpdateProduct = async ({
  id,
  credentials,
}: {
  id: string;
  credentials: FormProducts;
}): Promise<boolean> => {
  const formData = new FormData();

  formData.append("nombre", credentials.nombre);
  formData.append("sku", credentials.sku);
  formData.append("categoriaId", credentials.categoriaId);
  formData.append("impuestoId", credentials.impuestoId);
  formData.append("costo", credentials.costo);
  formData.append("precioVenta", String(credentials.precioVenta));
  formData.append("unidadMedida", credentials.unidadMedida);
  formData.append("stockInicial", String(credentials.stockInicial));
  formData.append("sucursalId", credentials.sucursalId);

  if (credentials.imagen) {
    formData.append("imagen", credentials.imagen);
  }

  const response = await fetch(`${settings.URL}/productos/${id}`, {
    method: "PUT",
    body: formData,
  });

  const payload = (await response.json()) as { success?: boolean } | boolean;

  if (!response.ok) {
    throw new Error("No se pudo actualizar el producto");
  }

  if (typeof payload === "boolean") {
    return payload;
  }

  return Boolean(payload?.success);
};

export const getProductById = async (
  id: string,
): Promise<ProductReadResponse> => {
  const response = await fetch(`${settings.URL}/productos/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as ProductReadResponse;

  if (!response.ok) {
    throw new Error("No se encontró el producto");
  }

  return payload;
};
