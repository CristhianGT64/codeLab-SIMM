import settings from "../lib/settings";
import type { SucursalResponse, Sucursal } from "../interfaces/SucursalInterface";

// 1. GET - Listar todas las sucursales
export const fetchSucursales = async (): Promise<SucursalResponse> => {
  const response = await fetch(`${settings.prueba}/sucursales`);
  if (!response.ok) throw new Error('Error al obtener sucursales');
  return response.json();
};

// 2. GET - Obtener una sucursal por su ID 
export const fetchSucursalById = async (id: string): Promise<SucursalResponse> => {
  const response = await fetch(`${settings.prueba}/sucursales/${id}`);
  if (!response.ok) throw new Error('Error al obtener la sucursal');
  return response.json();
};

// 3. POST - Crear nueva sucursal
export const createSucursal = async (nueva: Omit<Sucursal, 'id' | 'activa'>): Promise<SucursalResponse> => {
  const response = await fetch(`${settings.prueba}/sucursales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nueva),
  });
  if (!response.ok) throw new Error('Error al crear sucursal');
  return response.json();
};

// 4. PUT - Editar sucursal
export const updateSucursal = async (s: Sucursal): Promise<SucursalResponse> => {
  const response = await fetch(`${settings.prueba}/sucursales/${s.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(s),
  });
  if (!response.ok) throw new Error('Error al actualizar sucursal');
  return response.json();
};

// 5. PATCH - Activar/Desactivar sucursal
export const patchSucursalStatus = async (id: string, activa: boolean): Promise<SucursalResponse> => {
  const response = await fetch(`${settings.prueba}/sucursales/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activa }),
  });
  if (!response.ok) throw new Error('Error al cambiar estado');
  return response.json();
};