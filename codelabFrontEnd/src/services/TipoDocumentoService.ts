import settings from "../lib/settings";
import type {
  TipoDocumentoForm,
  TipoDocumentoListResponse,
  TipoDocumentoSingleResponse,
} from "../interfaces/TipodedocumentoInterface/TipoDocumentoInterface";

type RawTipoDocumento = {
  id?: string | number;
  id_tipo_documento?: string | number;
  codigo?: string | number;
  numero?: string | number;
  nombre?: string;
  descripcion?: string;
  prefijoNumeracion?: string;
  prefijo_numeracion?: string;
  prefijo?: string;
  requiereCai?: boolean;
  requiere_cai?: boolean;
  disponible?: boolean;
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
};

const DEFAULT_ESTABLECIMIENTO_ID = 1;
const DEFAULT_PUNTO_EMISION_ID = 1;

const toStringValue = (value: unknown) =>
  value === null || value === undefined ? "" : String(value);

const buildPrefijoFromCodigo = (codigo: string) => {
  const trimmed = codigo.trim();
  if (!trimmed) {
    return "";
  }

  const numericValue = Number(trimmed);
  if (Number.isNaN(numericValue)) {
    return trimmed;
  }

  return `0${Math.trunc(numericValue)}`;
};

const parseJsonSafe = async <T>(response: Response): Promise<T | null> => {
  const rawText = await response.text();
  if (!rawText) {
    return null;
  }

  try {
    return JSON.parse(rawText) as T;
  } catch {
    return null;
  }
};

const assertHttpOk = <T extends { message?: string; error?: { message?: string } }>(
  response: Response,
  payload: T | null,
  fallbackMessage: string,
) => {
  if (response.ok) {
    return;
  }

  const backendMessage = payload?.message?.trim() || payload?.error?.message?.trim();
  const statusMessage = `Error ${response.status} en tipos de documento.`;
  throw new Error(backendMessage || fallbackMessage || statusMessage);
};

const normalizeTipoDocumento = (raw: RawTipoDocumento) => {
  const id = toStringValue(raw.id ?? raw.id_tipo_documento);
  const codigo = toStringValue(raw.codigo ?? raw.numero);

  return {
    id,
    codigo,
    nombre: toStringValue(raw.nombre),
    descripcion: toStringValue(raw.descripcion),
    prefijoNumeracion: toStringValue(
      raw.prefijoNumeracion ?? raw.prefijo_numeracion ?? raw.prefijo,
    ),
    requiereCai: Boolean(raw.requiereCai ?? raw.requiere_cai),
    activo: Boolean(raw.activo ?? raw.disponible),
    createdAt: raw.createdAt ?? raw.created_at,
    updatedAt: raw.updatedAt ?? raw.updated_at,
  };
};

const buildRequestBody = (
  body: TipoDocumentoForm,
  options?: { forCreate?: boolean; includeFixedRelationFields?: boolean },
) => {
  const forCreate = Boolean(options?.forCreate);
  const includeFixedRelationFields = Boolean(options?.includeFixedRelationFields);
  const prefijoNumeracion = forCreate
    ? buildPrefijoFromCodigo(body.codigo)
    : body.prefijoNumeracion;
  const numero = Number(body.codigo);

  if (forCreate && Number.isNaN(numero)) {
    throw new Error("El código debe ser numérico para crear el tipo de documento.");
  }

  return {
    codigo: body.codigo,
    numero: Number.isNaN(numero) ? undefined : Math.trunc(numero),
    nombre: body.nombre,
    descripcion: body.descripcion,
    prefijoNumeracion,
    requiereCai: true,
    activo: body.activo,
    disponible: body.activo,
    establecimientoId:
      forCreate && includeFixedRelationFields ? DEFAULT_ESTABLECIMIENTO_ID : undefined,
    puntoEmisionId:
      forCreate && includeFixedRelationFields ? DEFAULT_PUNTO_EMISION_ID : undefined,
  };
};

export const listTiposDocumento = async (): Promise<TipoDocumentoListResponse> => {
  const response = await fetch(`${settings.URL}/tipos-documento`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = await parseJsonSafe<{
    success: boolean;
    data: RawTipoDocumento[];
    message?: string;
  }>(response);

  assertHttpOk(response, payload, "No se pudieron obtener los tipos de documento.");

  return {
    success: Boolean(payload?.success),
    data: Array.isArray(payload?.data)
      ? payload.data.map((item) => normalizeTipoDocumento(item))
      : [],
    message: payload?.message,
  };
};

export const listTiposDocumentoActivos = async (): Promise<TipoDocumentoListResponse> => {
  const response = await fetch(`${settings.URL}/tipos-documento/activos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = await parseJsonSafe<{
    success: boolean;
    data: RawTipoDocumento[];
    message?: string;
  }>(response);

  assertHttpOk(
    response,
    payload,
    "No se pudieron obtener los tipos de documento activos.",
  );

  return {
    success: Boolean(payload?.success),
    data: Array.isArray(payload?.data)
      ? payload.data.map((item) => normalizeTipoDocumento(item))
      : [],
    message: payload?.message,
  };
};

export const getTipoDocumentoById = async (
  id: string,
): Promise<TipoDocumentoSingleResponse> => {
  const response = await fetch(
    `${settings.URL}/tipos-documento/${encodeURIComponent(id)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const payload = await parseJsonSafe<{
    success: boolean;
    data: RawTipoDocumento;
    message?: string;
  }>(response);

  assertHttpOk(response, payload, "No se pudo obtener el tipo de documento.");

  return {
    success: Boolean(payload?.success),
    data: normalizeTipoDocumento(payload?.data ?? {}),
    message: payload?.message,
  };
};

export const createTipoDocumento = async (
  body: TipoDocumentoForm,
): Promise<TipoDocumentoSingleResponse> => {
  const requestBodyWithRelations = buildRequestBody(body, {
    forCreate: true,
    includeFixedRelationFields: true,
  });

  let response = await fetch(`${settings.URL}/tipos-documento`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBodyWithRelations),
  });

  let payload = await parseJsonSafe<{
    success: boolean;
    data: RawTipoDocumento;
    message?: string;
  }>(response);

  // Compatibilidad: si backend rechaza los campos de relación, reintenta con payload base.
  if (!response.ok && [400, 404, 422].includes(response.status)) {
    const requestBodyBase = buildRequestBody(body, {
      forCreate: true,
      includeFixedRelationFields: false,
    });

    response = await fetch(`${settings.URL}/tipos-documento`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBodyBase),
    });

    payload = await parseJsonSafe<{
      success: boolean;
      data: RawTipoDocumento;
      message?: string;
    }>(response);
  }

  assertHttpOk(response, payload, "No se pudo crear el tipo de documento.");

  return {
    success: Boolean(payload?.success),
    data: normalizeTipoDocumento(payload?.data ?? {}),
    message: payload?.message,
  };
};

export const updateTipoDocumento = async (
  id: string,
  body: TipoDocumentoForm,
): Promise<TipoDocumentoSingleResponse> => {
  const response = await fetch(
    `${settings.URL}/tipos-documento/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildRequestBody(body)),
    },
  );

  const payload = await parseJsonSafe<{
    success: boolean;
    data: RawTipoDocumento;
    message?: string;
  }>(response);

  assertHttpOk(response, payload, "No se pudo actualizar el tipo de documento.");

  return {
    success: Boolean(payload?.success),
    data: normalizeTipoDocumento(payload?.data ?? {}),
    message: payload?.message,
  };
};

export const changeTipoDocumentoStatus = async (
  id: string,
): Promise<TipoDocumentoSingleResponse> => {
  const response = await fetch(
    `${settings.URL}/tipos-documento/${encodeURIComponent(id)}/estado`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const payload = await parseJsonSafe<{
    success: boolean;
    data: RawTipoDocumento;
    message?: string;
  }>(response);

  assertHttpOk(
    response,
    payload,
    "No se pudo cambiar el estado del tipo de documento.",
  );

  return {
    success: Boolean(payload?.success),
    data: normalizeTipoDocumento(payload?.data ?? {}),
    message: payload?.message,
  };
};