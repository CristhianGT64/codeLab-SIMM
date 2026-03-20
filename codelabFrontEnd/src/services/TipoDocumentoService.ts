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

const toStringValue = (value: unknown) =>
  value === null || value === undefined ? "" : String(value);

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

const buildRequestBody = (body: TipoDocumentoForm) => ({
  codigo: body.codigo,
  numero: Number(body.codigo) || undefined,
  nombre: body.nombre,
  descripcion: body.descripcion,
  prefijoNumeracion: body.prefijoNumeracion,
  prefijo_numeracion: body.prefijoNumeracion,
  requiereCai: body.requiereCai,
  requiere_cai: body.requiereCai,
  activo: body.activo,
  disponible: body.activo,
});

export const listTiposDocumento = async (): Promise<TipoDocumentoListResponse> => {
  const response = await fetch(`${settings.URL}/tipos-documento`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as {
    success: boolean;
    data: RawTipoDocumento[];
    message?: string;
  };

  if (!response.ok) {
    throw new Error("No se pudieron obtener los tipos de documento.");
  }

  return {
    success: payload.success,
    data: Array.isArray(payload.data)
      ? payload.data.map((item) => normalizeTipoDocumento(item))
      : [],
    message: payload.message,
  };
};

export const listTiposDocumentoActivos = async (): Promise<TipoDocumentoListResponse> => {
  const response = await fetch(`${settings.URL}/tipos-documento/activos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as {
    success: boolean;
    data: RawTipoDocumento[];
    message?: string;
  };

  if (!response.ok) {
    throw new Error("No se pudieron obtener los tipos de documento activos.");
  }

  return {
    success: payload.success,
    data: Array.isArray(payload.data)
      ? payload.data.map((item) => normalizeTipoDocumento(item))
      : [],
    message: payload.message,
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

  const payload = (await response.json()) as {
    success: boolean;
    data: RawTipoDocumento;
    message?: string;
  };

  if (!response.ok) {
    throw new Error("No se pudo obtener el tipo de documento.");
  }

  return {
    success: payload.success,
    data: normalizeTipoDocumento(payload.data ?? {}),
    message: payload.message,
  };
};

export const createTipoDocumento = async (
  body: TipoDocumentoForm,
): Promise<TipoDocumentoSingleResponse> => {
  const response = await fetch(`${settings.URL}/tipos-documento`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildRequestBody(body)),
  });

  const payload = (await response.json()) as {
    success: boolean;
    data: RawTipoDocumento;
    message?: string;
  };

  if (!response.ok) {
    throw new Error("No se pudo crear el tipo de documento.");
  }

  return {
    success: payload.success,
    data: normalizeTipoDocumento(payload.data ?? {}),
    message: payload.message,
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

  const payload = (await response.json()) as {
    success: boolean;
    data: RawTipoDocumento;
    message?: string;
  };

  if (!response.ok) {
    throw new Error("No se pudo actualizar el tipo de documento.");
  }

  return {
    success: payload.success,
    data: normalizeTipoDocumento(payload.data ?? {}),
    message: payload.message,
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

  const payload = (await response.json()) as {
    success: boolean;
    data: RawTipoDocumento;
    message?: string;
  };

  if (!response.ok) {
    throw new Error("No se pudo cambiar el estado del tipo de documento.");
  }

  return {
    success: payload.success,
    data: normalizeTipoDocumento(payload.data ?? {}),
    message: payload.message,
  };
};