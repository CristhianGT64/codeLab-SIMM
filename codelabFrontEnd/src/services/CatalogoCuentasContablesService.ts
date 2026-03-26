import settings from "../lib/settings";
import type {
  ActualizarClasificacionContablePayload,
  ActualizarCuentaContablePayload,
  ActualizarElementoContablePayload,
  ActualizarSubCuentaContablePayload,
  ApiResponse,
  CambiarEstadoCatalogoPayload,
  CatalogoContableResumen,
  ClasificacionContable,
  CrearClasificacionContablePayload,
  CrearCuentaContablePayload,
  CrearElementoContablePayload,
  CrearSubCuentaContablePayload,
  CuentaContable,
  ElementoContable,
  NaturalezaContable,
  SubCuentaContable,
} from "../interfaces/CatalogoCuentasContables/CatalogoCuentasContables";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${settings.URL}${input}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const payload = (await response.json()) as { message?: string } & T;

  if (!response.ok) {
    throw new Error(payload.message || "Ocurrió un error al procesar la solicitud.");
  }

  return payload;
}

export const getCatalogoContableArbol = () =>
  request<ApiResponse<ElementoContable[]>>("/catalogo-contable/arbol", {
    method: "GET",
  });

export const getCatalogoContableResumen = () =>
  request<ApiResponse<CatalogoContableResumen>>("/catalogo-contable/resumen", {
    method: "GET",
  });

export const getNaturalezasContables = () =>
  request<ApiResponse<NaturalezaContable[]>>("/naturalezas-contables", {
    method: "GET",
  });

export const createElementoContable = (payload: CrearElementoContablePayload) =>
  request<ApiResponse<ElementoContable>>("/elementos-contables", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateElementoContable = ({ id, ...payload }: ActualizarElementoContablePayload) =>
  request<ApiResponse<ElementoContable>>(`/elementos-contables/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const changeElementoContableStatus = ({ id, disponible }: CambiarEstadoCatalogoPayload) =>
  request<ApiResponse<ElementoContable>>(`/elementos-contables/${id}/estado`, {
    method: "PATCH",
    body: JSON.stringify({ disponible }),
  });

export const createClasificacionContable = (payload: CrearClasificacionContablePayload) =>
  request<ApiResponse<ClasificacionContable>>("/clasificaciones-contables", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateClasificacionContable = ({ id, ...payload }: ActualizarClasificacionContablePayload) =>
  request<ApiResponse<ClasificacionContable>>(`/clasificaciones-contables/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const changeClasificacionContableStatus = ({ id, disponible }: CambiarEstadoCatalogoPayload) =>
  request<ApiResponse<ClasificacionContable>>(`/clasificaciones-contables/${id}/estado`, {
    method: "PATCH",
    body: JSON.stringify({ disponible }),
  });

export const createCuentaContable = (payload: CrearCuentaContablePayload) =>
  request<ApiResponse<CuentaContable>>("/cuentas-contables", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateCuentaContable = ({ id, ...payload }: ActualizarCuentaContablePayload) =>
  request<ApiResponse<CuentaContable>>(`/cuentas-contables/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const changeCuentaContableStatus = ({ id, disponible }: CambiarEstadoCatalogoPayload) =>
  request<ApiResponse<CuentaContable>>(`/cuentas-contables/${id}/estado`, {
    method: "PATCH",
    body: JSON.stringify({ disponible }),
  });

export const createSubCuentaContable = (payload: CrearSubCuentaContablePayload) =>
  request<ApiResponse<SubCuentaContable>>("/subcuentas-contables", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateSubCuentaContable = ({ id, ...payload }: ActualizarSubCuentaContablePayload) =>
  request<ApiResponse<SubCuentaContable>>(`/subcuentas-contables/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const changeSubCuentaContableStatus = ({ id, disponible }: CambiarEstadoCatalogoPayload) =>
  request<ApiResponse<SubCuentaContable>>(`/subcuentas-contables/${id}/estado`, {
    method: "PATCH",
    body: JSON.stringify({ disponible }),
  });