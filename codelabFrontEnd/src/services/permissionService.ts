import type {
  FormPermission,
  ResponseCategoriaPermiso,
} from "../interfaces/PermisosInterface/categoriaPermisos";
import type { ResponsePermisos } from "../interfaces/PermisosInterface/PermisosInterface";
import settings from "../lib/settings";

export const listPermisos = async (): Promise<ResponsePermisos> => {
  const response = await fetch(`${settings.URL}/permissions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as ResponsePermisos;

  if (!response.ok) {
    throw new Error("No se encontraron permisos");
  }

  return payload;
};

export const listCategoriaPermisos =
  async (): Promise<ResponseCategoriaPermiso> => {
    const response = await fetch(`${settings.URL}/permission-categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const payload = (await response.json()) as ResponseCategoriaPermiso;

    if (!response.ok) {
      throw new Error("No se encontro la categoria de permisos");
    }

    return payload;
  };

export const createPermission = async (
  credentials: FormPermission,
): Promise<boolean> => {
  const response = await fetch(`${settings.URL}/permissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const payload = (await response.json()) as { success?: boolean } | boolean;

  if (!response.ok) {
    throw new Error("No se pudo crear el usuario");
  }

  if (typeof payload === "boolean") {
    return payload;
  }

  return Boolean(payload?.success);
};
