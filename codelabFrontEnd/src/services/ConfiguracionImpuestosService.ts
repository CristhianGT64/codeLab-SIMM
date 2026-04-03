import type { ResponseImpuestoProducto } from "../interfaces/Products/FormProducts";
import type {
  ImpuestoConfiguracion,
  ImpuestoConfiguracionResponse,
  ImpuestoConfiguracionSingleResponse,
  SaveImpuestoConfiguracionPayload,
  UpdateImpuestoConfiguracionPayload,
} from "../interfaces/Configuracion/ImpuestoInterface";
import settings from "../lib/settings";

type ImpuestoApiItem = {
  id?: string | number;
  nombre?: string;
  porcentaje?: string | number;
  tasa?: string | number;
  activo?: boolean;
};

type GenericApiResponse<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  error?: {
    message?: string;
  };
};

const CONFIG_IMPUESTOS_ENDPOINT = `${settings.URL}/configuracion/impuestos`;
const LEGACY_IMPUESTOS_ENDPOINT = `${settings.URL}/impuestos`;

const toNumber = (value: unknown) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const normalizeRate = (value: unknown) => {
  const parsed = toNumber(value);
  const rate = Math.abs(parsed) > 1 ? parsed / 100 : parsed;
  return Number(rate.toFixed(4));
};

const normalizeImpuesto = (item: ImpuestoApiItem): ImpuestoConfiguracion => {
  const tasa = normalizeRate(item.porcentaje ?? item.tasa ?? 0);

  return {
    id: String(item.id ?? ""),
    nombre: String(item.nombre ?? ""),
    porcentaje: Number((tasa * 100).toFixed(2)),
    tasa,
    activo: item.activo ?? true,
  };
};

const getErrorMessage = (payload: GenericApiResponse<unknown>, fallback: string) =>
  payload.error?.message ?? payload.message ?? fallback;

const listFromEndpoint = async (endpoint: string) => {
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload =
    (await response.json()) as GenericApiResponse<ImpuestoApiItem[]>;

  return { response, payload };
};

const buildMutationPayload = (payload: SaveImpuestoConfiguracionPayload) => {
  const porcentaje = Number(payload.porcentaje);

  return {
    nombre: payload.nombre.trim(),
    porcentaje,
    tasa: Number((porcentaje / 100).toFixed(4)),
  };
};

export const listImpuestosConfiguracion =
  async (): Promise<ImpuestoConfiguracionResponse> => {
    const firstAttempt = await listFromEndpoint(CONFIG_IMPUESTOS_ENDPOINT);

    if (firstAttempt.response.ok) {
      return {
        success: firstAttempt.payload.success ?? true,
        data: (firstAttempt.payload.data ?? []).map(normalizeImpuesto),
        message: firstAttempt.payload.message,
      };
    }

    if (firstAttempt.response.status !== 404) {
      throw new Error(
        getErrorMessage(
          firstAttempt.payload,
          "No se pudieron obtener los impuestos configurados.",
        ),
      );
    }

    const legacyAttempt = await listFromEndpoint(LEGACY_IMPUESTOS_ENDPOINT);

    if (!legacyAttempt.response.ok) {
      throw new Error(
        getErrorMessage(
          legacyAttempt.payload,
          "No se pudieron obtener los impuestos configurados.",
        ),
      );
    }

    return {
      success: legacyAttempt.payload.success ?? true,
      data: (legacyAttempt.payload.data ?? []).map(normalizeImpuesto),
      message: legacyAttempt.payload.message,
    };
  };

export const createImpuestoConfiguracion = async (
  payload: SaveImpuestoConfiguracionPayload,
): Promise<ImpuestoConfiguracionSingleResponse> => {
  const response = await fetch(CONFIG_IMPUESTOS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildMutationPayload(payload)),
  });

  const parsed =
    (await response.json()) as GenericApiResponse<ImpuestoApiItem>;

  if (!response.ok) {
    throw new Error(
      getErrorMessage(parsed, "No se pudo registrar el impuesto."),
    );
  }

  return {
    success: parsed.success ?? true,
    data: normalizeImpuesto(parsed.data ?? {}),
    message: parsed.message,
  };
};

export const updateImpuestoConfiguracion = async (
  payload: UpdateImpuestoConfiguracionPayload,
): Promise<ImpuestoConfiguracionSingleResponse> => {
  const response = await fetch(`${CONFIG_IMPUESTOS_ENDPOINT}/${payload.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildMutationPayload(payload)),
  });

  const parsed =
    (await response.json()) as GenericApiResponse<ImpuestoApiItem>;

  if (!response.ok) {
    throw new Error(
      getErrorMessage(parsed, "No se pudo actualizar el impuesto."),
    );
  }

  return {
    success: parsed.success ?? true,
    data: normalizeImpuesto(parsed.data ?? {}),
    message: parsed.message,
  };
};

export const listImpuestosAsProductOptions =
  async (): Promise<ResponseImpuestoProducto> => {
    const response = await listImpuestosConfiguracion();

    return {
      success: response.success,
      data: response.data
        .filter((impuesto) => impuesto.activo)
        .map((impuesto) => ({
          id: impuesto.id,
          nombre: impuesto.nombre,
          tasa: impuesto.tasa,
        })),
    };
  };
