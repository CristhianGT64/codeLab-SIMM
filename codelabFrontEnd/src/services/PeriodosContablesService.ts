import type {
  PeriodoContable,
  PeriodoContableEstado,
  PeriodoContableFormData,
  PeriodoContableListResponse,
  PeriodoContableResponse,
  TipoPeriodoContable,
} from "../interfaces/PeriodosContables/PeriodoContableInterface";
import settings from "../lib/settings";
import {
  getPeriodoContableClave,
  getPeriodoContableTipo,
  isPeriodoContableActivo,
} from "../utils/periodosContables";

type ApiRecord = Record<string, unknown>;
type ApiResponse<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  error?: {
    message?: string;
  };
};

const LIST_KEYS = ["items", "rows", "periodos", "periodosContables", "resultados"];

const isApiRecord = (value: unknown): value is ApiRecord =>
  typeof value === "object" && value !== null;

const asApiRecord = (value: unknown): ApiRecord =>
  isApiRecord(value) ? value : {};

const asApiRecordArray = (value: unknown): ApiRecord[] =>
  Array.isArray(value) ? value.map(asApiRecord) : [];

const asString = (value: unknown, fallback = ""): string =>
  typeof value === "string"
    ? value
    : typeof value === "number" || typeof value === "bigint"
      ? String(value)
      : fallback;

const asNullableString = (value: unknown): string | null => {
  const normalized = asString(value);
  return normalized ? normalized : null;
};

const normalizeEstado = (value: unknown): PeriodoContableEstado => {
  const normalized = asString(value, "ABIERTO").trim().toUpperCase();
  return normalized === "CERRADO" ? "CERRADO" : "ABIERTO";
};

const normalizeTipo = (
  value: unknown,
  fallback: TipoPeriodoContable,
): TipoPeriodoContable => {
  const normalized = asString(value).trim().toUpperCase();

  if (normalized === "MENSUAL" || normalized === "ANUAL" || normalized === "PERSONALIZADO") {
    return normalized;
  }

  return fallback;
};

const getPayloadMessage = (payload: unknown, fallback: string) => {
  if (!isApiRecord(payload)) {
    return fallback;
  }

  if (isApiRecord(payload.error) && payload.error.message) {
    return asString(payload.error.message, fallback);
  }

  return asString(payload.message, fallback);
};

const getSucursalNombre = (value: ApiRecord) =>
  asString(
    value.sucursalNombre
    ?? value.nombreSucursal
    ?? (isApiRecord(value.sucursal) ? value.sucursal.nombre : ""),
    "Sucursal no disponible",
  );

const getUsuarioCierreNombre = (value: ApiRecord) =>
  asNullableString(
    value.usuarioCierreNombre
    ?? value.nombreUsuarioCierre
    ?? (isApiRecord(value.usuarioCierre)
      ? value.usuarioCierre.nombreCompleto ?? value.usuarioCierre.nombre
      : ""),
  );

const mapPeriodoContable = (value: ApiRecord): PeriodoContable => {
  const fechaInicio = asString(value.fechaInicio ?? value.fecha_inicio);
  const fechaFin = asString(value.fechaFin ?? value.fecha_fin);
  const estado = normalizeEstado(value.estado);
  const fallbackTipo = getPeriodoContableTipo({ fechaInicio, fechaFin });
  const activo =
    Boolean(value.activo ?? value.esActivo ?? value.periodoActivo)
    || isPeriodoContableActivo({ fechaInicio, fechaFin, estado });

  return {
    id: asString(value.id),
    sucursalId: asString(
      value.sucursalId
      ?? value.idSucursal
      ?? value.id_sucursal
      ?? (isApiRecord(value.sucursal) ? value.sucursal.id : ""),
    ),
    sucursalNombre: getSucursalNombre(value),
    fechaInicio,
    fechaFin,
    estado,
    fechaCierre: asNullableString(value.fechaCierre ?? value.fecha_cierre),
    usuarioCierreId: asNullableString(
      value.usuarioCierreId
      ?? value.usuario_cierre
      ?? (isApiRecord(value.usuarioCierre) ? value.usuarioCierre.id : ""),
    ),
    usuarioCierreNombre: getUsuarioCierreNombre(value),
    activo,
    tipo: normalizeTipo(value.tipo, fallbackTipo),
    periodoClave:
      asString(value.periodoClave ?? value.periodoContable ?? value.periodo)
      || getPeriodoContableClave({ fechaInicio, fechaFin }),
  };
};

const getListSource = (payload: unknown) => {
  const source = isApiRecord(payload) && "data" in payload ? payload.data : payload;

  if (Array.isArray(source)) {
    return source;
  }

  if (!isApiRecord(source)) {
    return null;
  }

  const matchedKey = LIST_KEYS.find((key) => Array.isArray(source[key]));
  return matchedKey ? source[matchedKey] : null;
};

const mapListResponse = (payload: unknown): PeriodoContable[] | null => {
  const source = getListSource(payload);

  if (source === null) {
    return null;
  }

  return asApiRecordArray(source)
    .map(mapPeriodoContable)
    .sort((a, b) => {
      if (a.activo !== b.activo) {
        return a.activo ? -1 : 1;
      }

      if (a.estado !== b.estado) {
        return a.estado === "ABIERTO" ? -1 : 1;
      }

      return b.fechaInicio.localeCompare(a.fechaInicio);
    });
};

const mapItemResponse = (payload: unknown): PeriodoContable | null => {
  const source = isApiRecord(payload) && "data" in payload ? payload.data : payload;

  if (!isApiRecord(source)) {
    return null;
  }

  return mapPeriodoContable(source);
};

const getRequestHeaders = () => ({
  "Content-Type": "application/json",
});

const buildPeriodoPayload = (payload: PeriodoContableFormData) => ({
  sucursalId: payload.sucursalId,
  fechaInicio: payload.fechaInicio,
  fechaFin: payload.fechaFin,
});

export const listPeriodosContables = async (): Promise<PeriodoContableListResponse> => {
  const response = await fetch(`${settings.URL}/periodos-contables`, {
    method: "GET",
    headers: getRequestHeaders(),
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<unknown> | unknown;

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("El endpoint /periodos-contables no existe en el backend actual.");
    }

    throw new Error(
      getPayloadMessage(payload, "No se pudieron obtener los periodos contables."),
    );
  }

  const data = mapListResponse(payload);

  if (!data) {
    throw new Error("El formato de respuesta de periodos contables no es valido.");
  }

  return {
    success: true,
    data,
    message: getPayloadMessage(payload, ""),
  };
};

export const getPeriodoContableById = async (
  id: string,
): Promise<PeriodoContableResponse> => {
  const response = await fetch(`${settings.URL}/periodos-contables/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: getRequestHeaders(),
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<unknown> | unknown;

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("El endpoint /periodos-contables/:id no existe en el backend actual.");
    }

    throw new Error(
      getPayloadMessage(payload, "No se pudo obtener el periodo contable."),
    );
  }

  const data = mapItemResponse(payload);

  if (!data) {
    throw new Error("El formato de respuesta del periodo contable no es valido.");
  }

  return {
    success: true,
    data,
    message: getPayloadMessage(payload, ""),
  };
};

export const createPeriodoContable = async (
  payload: PeriodoContableFormData,
): Promise<PeriodoContableResponse> => {
  const response = await fetch(`${settings.URL}/periodos-contables`, {
    method: "POST",
    headers: getRequestHeaders(),
    body: JSON.stringify(buildPeriodoPayload(payload)),
  });

  const responsePayload = (await response.json().catch(() => null)) as ApiResponse<unknown> | unknown;

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("El endpoint POST /periodos-contables no existe en el backend actual.");
    }

    throw new Error(
      getPayloadMessage(responsePayload, "No se pudo crear el periodo contable."),
    );
  }

  const data = mapItemResponse(responsePayload);

  if (!data) {
    throw new Error("El formato de respuesta del periodo creado no es valido.");
  }

  return {
    success: true,
    data,
    message: getPayloadMessage(responsePayload, "Periodo contable creado correctamente."),
  };
};

export const updatePeriodoContable = async (
  payload: PeriodoContableFormData & { id: string },
): Promise<PeriodoContableResponse> => {
  const response = await fetch(`${settings.URL}/periodos-contables/${encodeURIComponent(payload.id)}`, {
    method: "PUT",
    headers: getRequestHeaders(),
    body: JSON.stringify(buildPeriodoPayload(payload)),
  });

  const responsePayload = (await response.json().catch(() => null)) as ApiResponse<unknown> | unknown;

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("El endpoint PUT /periodos-contables/:id no existe en el backend actual.");
    }

    throw new Error(
      getPayloadMessage(responsePayload, "No se pudo actualizar el periodo contable."),
    );
  }

  const data = mapItemResponse(responsePayload);

  if (!data) {
    throw new Error("El formato de respuesta del periodo actualizado no es valido.");
  }

  return {
    success: true,
    data,
    message: getPayloadMessage(responsePayload, "Periodo contable actualizado correctamente."),
  };
};

export const cerrarPeriodoContable = async (
  payload: { id: string; usuarioCierreId: string },
): Promise<PeriodoContableResponse> => {
  const response = await fetch(`${settings.URL}/periodos-contables/${encodeURIComponent(payload.id)}/cerrar`, {
    method: "PATCH",
    headers: getRequestHeaders(),
    body: JSON.stringify({
      usuarioCierreId: payload.usuarioCierreId,
    }),
  });

  const responsePayload = (await response.json().catch(() => null)) as ApiResponse<unknown> | unknown;

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("El endpoint PATCH /periodos-contables/:id/cerrar no existe en el backend actual.");
    }

    throw new Error(
      getPayloadMessage(responsePayload, "No se pudo cerrar el periodo contable."),
    );
  }

  const data = mapItemResponse(responsePayload);

  if (!data) {
    throw new Error("El formato de respuesta del cierre de periodo no es valido.");
  }

  return {
    success: true,
    data,
    message: getPayloadMessage(responsePayload, "Periodo contable cerrado correctamente."),
  };
};
