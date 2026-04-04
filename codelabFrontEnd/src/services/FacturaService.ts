import settings from "../lib/settings";
import type {
  FacturaHistorialDetail,
  FacturaHistorialFilters,
  FacturaHistorialItem,
  FacturaEstado,
  FacturaTotalesHistorial,
} from "../interfaces/Facturas/IFacturasHistorial";
import type { FacturaRequest, FacturaResponse } from "../interfaces/POS/IFactura";

type ApiRecord = Record<string, unknown>;
type ApiResponse<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  error?: {
    message?: string;
  };
};

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

const asNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
};

const normalizeEstado = (value: unknown): FacturaEstado => {
  const normalized = asString(value, "pagada").trim().toLowerCase();

  if (normalized === "anulada") {
    return "anulada";
  }

  if (normalized === "pendiente") {
    return "pendiente";
  }

  return "pagada";
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

const buildHistoryQuery = (filters: FacturaHistorialFilters = {}) => {
  const query = new URLSearchParams();

  if (filters.usuarioId) {
    query.set("usuarioId", filters.usuarioId);
  }

  if (filters.clienteId) {
    query.set("clienteId", filters.clienteId);
  }

  if (filters.sucursalId) {
    query.set("sucursalId", filters.sucursalId);
  }

  if (filters.fechaInicio) {
    query.set("fechaInicio", filters.fechaInicio);
  }

  if (filters.fechaFin) {
    query.set("fechaFin", filters.fechaFin);
  }

  return query.toString();
};

const mapFacturaTotales = (value: unknown): FacturaTotalesHistorial => {
  const source = asApiRecord(value);

  return {
    exento: asNumber(source.exento),
    gravado15: asNumber(source.gravado15),
    gravado18: asNumber(source.gravado18),
    isv15: asNumber(source.isv15),
    isv18: asNumber(source.isv18),
    total: asNumber(source.total),
  };
};

const mapCliente = (value: unknown) => {
  if (!isApiRecord(value)) {
    return null;
  }

  return {
    nombre: asString(value.nombre, "Consumidor Final"),
    identificacion: asNullableString(value.identificacion),
  };
};

const mapUsuario = (value: unknown) => {
  if (!isApiRecord(value)) {
    return null;
  }

  return {
    nombre: asString(value.nombre, "Sin usuario"),
    usuario: asNullableString(value.usuario),
  };
};

const mapSucursal = (value: unknown) => {
  if (!isApiRecord(value)) {
    return null;
  }

  return {
    nombre: asString(value.nombre, "Sucursal N/A"),
    direccion: asNullableString(value.direccion),
  };
};

const mapCai = (value: unknown) => {
  if (!isApiRecord(value)) {
    return null;
  }

  return {
    codigo: asString(value.codigo),
    fechaLimite: asNullableString(value.fechaLimite),
  };
};

const mapRangoEmision = (value: unknown) => {
  if (!isApiRecord(value)) {
    return null;
  }

  return {
    inicio: asNumber(value.inicio),
    fin: asNumber(value.fin),
  };
};

const mapDetalle = (value: ApiRecord) => ({
  id: asString(value.id),
  productoId: asString(value.productoId),
  producto: asString(value.producto, "N/A"),
  cantidad: asNumber(value.cantidad),
  precioUnitario: asNumber(value.precioUnitario),
  subtotal: asNumber(value.subtotal),
  tasaImpuesto: asNumber(value.tasaImpuesto),
  montoImpuesto: asNumber(value.montoImpuesto),
  tipoImpuesto: asString(value.tipoImpuesto),
});

const mapFacturaHistorialItem = (value: ApiRecord): FacturaHistorialItem => ({
  facturaId: asString(value.facturaId ?? value.id),
  numeroFactura: asString(value.numeroFactura, "N/A"),
  fechaEmision: asNullableString(value.fechaEmision),
  clienteId: asNullableString(value.clienteId),
  usuarioId: asNullableString(value.usuarioId),
  sucursalId: asNullableString(value.sucursalId),
  ventaId: asNullableString(value.ventaId),
  estadoFactura: normalizeEstado(value.estadoFactura),
  saldoPendiente: asNumber(value.saldoPendiente),
  detallesCount: asNumber(value.detallesCount),
  cliente: mapCliente(value.cliente),
  usuario: mapUsuario(value.usuario),
  sucursal: mapSucursal(value.sucursal),
  totales: mapFacturaTotales(value.totales),
});

const mapFacturaHistorialDetail = (value: ApiRecord): FacturaHistorialDetail => ({
  ...mapFacturaHistorialItem(value),
  detalles: asApiRecordArray(value.detalles).map(mapDetalle),
  cai: mapCai(value.cai),
  rangoEmision: mapRangoEmision(value.rangoEmision),
});

const getFileNameFromDisposition = (value: string | null) => {
  if (!value) {
    return "historial-facturacion.pdf";
  }

  const utfMatch = value.match(/filename\*=UTF-8''([^;]+)/i);

  if (utfMatch?.[1]) {
    return decodeURIComponent(utfMatch[1]);
  }

  const match = value.match(/filename="?([^";]+)"?/i);
  return match?.[1] ?? "historial-facturacion.pdf";
};

export const createFactura = async (
  request: FacturaRequest,
): Promise<FacturaResponse> => {
  const response = await fetch(`${settings.URL}/facturas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const payload = (await response.json()) as FacturaResponse;

  if (!response.ok) {
    throw new Error("No se pudo generar la factura");
  }

  return payload;
};

export const listFacturas = async (
  filters: FacturaHistorialFilters = {},
): Promise<FacturaHistorialItem[]> => {
  const query = buildHistoryQuery(filters);
  const response = await fetch(
    `${settings.URL}/facturas${query ? `?${query}` : ""}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const payload = (await response.json()) as ApiResponse<unknown>;

  if (!response.ok) {
    throw new Error(
      getPayloadMessage(payload, "No se pudo obtener el historial de facturacion."),
    );
  }

  return asApiRecordArray(payload.data).map(mapFacturaHistorialItem);
};

export const getFacturaByNumero = async (
  numeroFactura: string,
): Promise<FacturaHistorialDetail> => {
  const response = await fetch(
    `${settings.URL}/facturas/${encodeURIComponent(numeroFactura)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const payload = (await response.json()) as ApiResponse<unknown>;

  if (!response.ok) {
    throw new Error(
      getPayloadMessage(payload, "No se pudo obtener el detalle de la factura."),
    );
  }

  return mapFacturaHistorialDetail(asApiRecord(payload.data));
};

export const exportFacturas = async (filters: FacturaHistorialFilters = {}) => {
  const query = buildHistoryQuery(filters);
  const response = await fetch(
    `${settings.URL}/facturas/exportar${query ? `?${query}` : ""}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;

    throw new Error(
      getPayloadMessage(errorPayload, "No se pudo exportar el historial de facturacion."),
    );
  }

  return {
    blob: await response.blob(),
    fileName: getFileNameFromDisposition(response.headers.get("Content-Disposition")),
  };
};
