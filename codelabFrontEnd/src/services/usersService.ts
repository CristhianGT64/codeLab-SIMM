import settings from "../lib/settings";
import type { LoginRequest, LoginResponse } from "../interfaces/LoginResponse";
import type {
  User,
  UsersResponse,
  booleanResponse,
} from "../interfaces/Users/UserInterface";
import type { FormUserState } from "../interfaces/Users/FormUserInterface";

interface UserResponse {
  success: boolean;
  data: User;
}

export const loginUser = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  const response = await fetch(`${settings.URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const payload = (await response.json()) as LoginResponse;

  if (!response.ok) {
    throw new Error(payload.message || "No se pudo iniciar sesión");
  }

  return payload;
};

export const createUser = async (
  credentials: FormUserState,
): Promise<boolean> => {
  const response = await fetch(`${settings.URL}/usuarios`, {
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

export const listUser = async (): Promise<UsersResponse> => {
  const response = await fetch(`${settings.URL}/usuarios`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as UsersResponse;

  if (!response.ok) {
    throw new Error("No se encontraron usuarios");
  }

  return payload;
};

export const getUserById = async (id: string): Promise<UserResponse> => {
  const response = await fetch(`${settings.URL}/usuarios/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as UserResponse;

  if (!response.ok) {
    throw new Error("No se encontró el usuario");
  }

  return payload;
};

export const updateUser = async ({
  id,
  credentials,
}: {
  id: string;
  credentials: FormUserState;
}): Promise<booleanResponse> => {
  const response = await fetch(`${settings.URL}/usuarios/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const payload = (await response.json()) as booleanResponse;

  if (!response.ok) {
    throw new Error("No se pudo actualizar el usuario");
  }

  if (typeof payload === "boolean") {
    return payload;
  }

  return validatePlayload(response, payload);
};

export const deleteUser = async (id: string): Promise<booleanResponse> => {
  const response = await fetch(`${settings.URL}/usuarios/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as booleanResponse;

  return validatePlayload(response, payload);
};

export const inactivateUser = async (id: string): Promise<booleanResponse> => {
  const response = await fetch(`${settings.URL}/usuarios/${id}/inactivo`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as booleanResponse;

  return validatePlayload(response, payload);
};

export const activateUser = async (id: string): Promise<booleanResponse> => {
  const response = await fetch(`${settings.URL}/usuarios/${id}/activo`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as booleanResponse;

  return validatePlayload(response, payload);
};

const validatePlayload = (
  response: any,
  payload: booleanResponse,
): booleanResponse => {
  if (!response.ok) {
    throw new Error("No se pudo eliminar el usuario");
  }
  if (typeof payload === "boolean") {
    return payload;
  }

  return { success: payload.success };
};
