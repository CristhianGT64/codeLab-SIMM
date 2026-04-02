import type {
  TipoCliente,
  TipoClienteResponse,
  TipoClienteSingleResponse,
} from "../interfaces/TiposdeCliente/TipoClienteInterface";
import settings from "../lib/settings";

// 1 - Listar todos los tipos de cliente
export const listTiposCliente = async (
  search?: string,
): Promise<TipoClienteResponse> => {
  const url = search
    ? `${settings.URL}/tipos-cliente?search=${encodeURIComponent(search)}`
    : `${settings.URL}/tipos-cliente`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const payload = (await response.json()) as TipoClienteResponse;

  if (!response.ok) {
    throw new Error("No se pudieron obtener los tipos de cliente.");
  }

  return payload;
};

// 2 - Obtener tipo de cliente por id
export const getTipoClienteById = async (
  id: string,
): Promise<TipoClienteSingleResponse> => {
  const response = await fetch(`${settings.URL}/tipos-cliente/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const payload = (await response.json()) as TipoClienteSingleResponse;

  if (!response.ok) {
    throw new Error("No se pudo obtener el tipo de cliente.");
  }

  return payload;
};

// 3 - Crear tipo de cliente
export const createTipoCliente = async (
  nuevo: Omit<TipoCliente, "id" | "disponible" | "fechaCreacion" | "_count">,
): Promise<TipoClienteSingleResponse> => {
  const response = await fetch(`${settings.URL}/tipos-cliente`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevo),
  });

  const payload = (await response.json()) as TipoClienteSingleResponse;

  if (!response.ok) {
    const msg =
      (payload as unknown as { error?: { message?: string } }).error?.message ??
      "No se pudo crear el tipo de cliente.";
    throw new Error(msg);
  }

  return payload;
};

// 4 - Actualizar tipo de cliente
export const updateTipoCliente = async (
  tipoCliente: TipoCliente,
): Promise<TipoClienteSingleResponse> => {
  const { id, ...rest } = tipoCliente;
  const response = await fetch(`${settings.URL}/tipos-cliente/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rest),
  });

  const payload = (await response.json()) as TipoClienteSingleResponse;

  if (!response.ok) {
    throw new Error("No se pudo actualizar el tipo de cliente.");
  }

  return payload;
};

// 5 - Cambiar estado (activar/inactivar)
export const changeTipoClienteStatus = async (
  id: string,
  disponible: boolean,
): Promise<TipoClienteSingleResponse> => {
  const response = await fetch(`${settings.URL}/tipos-cliente/${id}/estado`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ disponible }),
  });

  const payload = (await response.json()) as TipoClienteSingleResponse;

  if (!response.ok) {
    const msg =
      (payload as unknown as { error?: { message?: string } }).error?.message ??
      "No se pudo cambiar el estado del tipo de cliente.";
    throw new Error(msg);
  }

  return payload;
};
