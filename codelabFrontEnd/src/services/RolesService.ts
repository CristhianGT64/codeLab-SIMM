
import type { FormRol, CreateRolResponse, RolByIdResponse } from "../interfaces/RolesInterface/RolesInterface";
import type RolResponse from "../interfaces/RolesInterface/RolesInterface";
import type { FormPermisoSeleccionados } from "../interfaces/PermisosInterface/PermisosInterface";
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
    throw new Error("No se encontraron roles");
  }

  return payload;

};

export const createRol = async (
  credentials: FormRol,
): Promise<CreateRolResponse> => {
  const response = await fetch(`${settings.URL}/roles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const payload = (await response.json()) as CreateRolResponse;

  if (!response.ok) {
    throw new Error("No se pudo crear el rol");
  }

  return payload;
};

export const assignPermissionsToRole = async (
  roleId: string,
  body: FormPermisoSeleccionados,
): Promise<boolean> => {
  const response = await fetch(`${settings.URL}/roles/${encodeURIComponent(roleId)}/permissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("No se pudieron asignar los permisos al rol");
  }

  return true;
};

export const deleteRol = async (id: string): Promise<boolean> => {
  const response = await fetch(`${settings.URL}/roles/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as boolean;

  if (!response.ok) {
    throw new Error("No se pudo eliminar el rol");
  }

  return payload;
};

export const getRolById = async (id: string): Promise<RolByIdResponse> => {
  const response = await fetch(`${settings.URL}/roles/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as RolByIdResponse;

  if (!response.ok) {
    throw new Error("No se pudo obtener el rol");
  }

  return payload;
};

export const updateRolPermissions = async (
  roleId: string,
  body: FormPermisoSeleccionados,
): Promise<boolean> => {
  const response = await fetch(`${settings.URL}/roles/${encodeURIComponent(roleId)}/permissions`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("No se pudieron actualizar los permisos del rol");
  }

  return true;
};
