import type { Sucursal, SucursalResponse } from "../interfaces/Sucursales/SucursalInterface.ts";
import settings from "../lib/settings";

// 1 - Listar todas las sucursales
export const listSucursales = async (): Promise<SucursalResponse> => {
  const response = await fetch(`${settings.URL}/sucursales`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as SucursalResponse;

  if (!response.ok) {
    throw new Error("No se pudieron obtener las sucursales.");
  }

  return payload;
};

// 2 - Obtener sucursal por id
export const getSucursalById = async (id: string): Promise<SucursalResponse> => {
  const response = await fetch(`${settings.URL}/sucursales/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const payload = (await response.json()) as SucursalResponse;

  if (!response.ok) {
    throw new Error("No se pudo obtener la sucursal.");
  }

  return payload;
};

// 3 - Crear sucursal
export const createSucursal = async (
  nueva: Omit<Sucursal, 'id' | 'activa'>,
): Promise<SucursalResponse> => {
  const response = await fetch(`${settings.URL}/sucursales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nueva),
  });
  const payload = (await response.json()) as SucursalResponse;

  if (!response.ok) {
    throw new Error('No se pudo crear la sucursal.');
  }
  return payload;
};

// 4 - Actualizar sucursal
export const updateSucursal = async (s: Sucursal): Promise<SucursalResponse> => {
  // remove id from body payload, the endpoint derives it from the URL
  const { id, ...rest } = s;
  const response = await fetch(`${settings.URL}/sucursales/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rest),
  });
  const payload = (await response.json()) as SucursalResponse;

  if (!response.ok) {
    throw new Error('No se pudo actualizar la sucursal.');
  }
  return payload;
};

// 5 - Cambiar estado (activar/inactivar)
export const changeSucursalStatus = async (
  id: string,
): Promise<SucursalResponse> => {
  const response = await fetch(`${settings.URL}/sucursales/${id}/estado`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  });
  const payload = (await response.json()) as SucursalResponse;

  if (!response.ok) {
    throw new Error('No se pudo cambiar el estado de la sucursal');
  }
  return payload;
};