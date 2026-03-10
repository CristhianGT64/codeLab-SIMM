import type {
  CreateCategoriaPermission,
  FormPermission,
  ResponseCategoriaPermiso,
  ResponseCategoryPermission,
  ResponsePermisosXCategoria,
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

export const listPermisosxCategoria =
  async (): Promise<ResponsePermisosXCategoria> => {
    const response = await fetch(`${settings.URL}/permission-categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const payload = (await response.json()) as ResponsePermisosXCategoria;

    if (!response.ok) {
      throw new Error("No se encontro los permisos por categoria");
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

export const createCategoriaPermission = async (
  credentials: CreateCategoriaPermission,
): Promise<ResponseCategoryPermission> => {
  const response = await fetch(`${settings.URL}/permission-categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const payload = (await response.json()) as ResponseCategoryPermission;

  if (!response.ok) {
    throw new Error("No se pudo crear la categoria de permiso");
  }

  return payload;
};

export const createPermissionRol = async (
  credentials: CreateCategoriaPermission,
  id : string
): Promise<ResponseCategoryPermission> => {
  const response = await fetch(`${settings.URL}/roles/${id}/permissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const payload = (await response.json()) as ResponseCategoryPermission;

  if (!response.ok) {
    throw new Error("No se pudo crear la categoria de permiso");
  }

  return payload;
};
