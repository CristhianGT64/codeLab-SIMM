import settings from "../lib/settings";
import type { SaleRequest, SaleResponse } from "../interfaces/POS/IPos";
import type {
  VentaClienteResumen,
  VentaDetalle,
  VentaDetalleItem,
  VentaHistorialDetalleItem,
  VentaHistorialItem,
  VentaProductoDetalle,
  VentaSucursalResumen,
  VentaUsuarioResumen,
} from "../interfaces/POS/IVentasHistorial";

type ApiRecord = Record<string, unknown>;
type ApiResponse<T> = {
  success: boolean;
  data: T;
};

const isApiRecord = (value: unknown): value is ApiRecord =>
  typeof value === "object" && value !== null;

const asApiRecord = (value: unknown): ApiRecord =>
  isApiRecord(value) ? value : {};

const asApiRecordArray = (value: unknown): ApiRecord[] =>
  Array.isArray(value) ? value.map(asApiRecord) : [];

const asString = (value: unknown): string =>
  typeof value === "string"
    ? value
    : typeof value === "number" || typeof value === "bigint"
      ? String(value)
      : "";

const asNullableString = (value: unknown): string | null => {
  const normalized = asString(value);
  return normalized ? normalized : null;
};

const asNumber = (value: unknown): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const mapVentaCliente = (value: unknown): VentaClienteResumen | null => {
  if (!isApiRecord(value)) {
    return null;
  }

  return {
    id: asString(value.id),
    nombreCompleto: asNullableString(value.nombreCompleto),
    identificacion: asNullableString(value.identificacion),
  };
};

const mapVentaUsuario = (value: unknown): VentaUsuarioResumen | null => {
  if (!isApiRecord(value)) {
    return null;
  }

  return {
    id: asString(value.id),
    nombreCompleto: asNullableString(value.nombreCompleto),
    usuario: asNullableString(value.usuario),
  };
};

const mapVentaSucursal = (value: unknown): VentaSucursalResumen | null => {
  if (!isApiRecord(value)) {
    return null;
  }

  return {
    id: asString(value.id),
    nombre: asNullableString(value.nombre),
  };
};

const mapDetalleVenta = (value: ApiRecord): VentaHistorialDetalleItem => ({
  id: asString(value.id),
  productoId: asString(value.productoId),
  cantidad: asNumber(value.cantidad),
  precioUnitario: asNumber(value.precioUnitario),
  subtotal: asNumber(value.subtotal),
});

const mapProductoDetalle = (value: unknown): VentaProductoDetalle | null => {
  if (!isApiRecord(value)) {
    return null;
  }

  return {
    id: asString(value.id),
    nombre: asNullableString(value.nombre),
    sku: asNullableString(value.sku),
    precioVenta: asNumber(value.precioVenta),
    unidadMedida: asNullableString(value.unidadMedida),
  };
};

const mapDetalleVentaConProducto = (value: ApiRecord): VentaDetalleItem => ({
  ...mapDetalleVenta(value),
  producto: mapProductoDetalle(value.producto),
});

const mapVentaBase = (value: ApiRecord) => ({
  id: asString(value.id),
  total: asNumber(value.total),
  estado: asString(value.estado),
  createdAt: asNullableString(value.createdAt),
  clienteId: asNullableString(value.clienteId),
  usuarioId: asString(value.usuarioId),
  sucursalId: asString(value.sucursalId),
  nombreUsuario: asNullableString(value.nombreUsuario),
  nombreSucursal: asNullableString(value.nombreSucursal),
  cliente: mapVentaCliente(value.cliente),
});

const getSubtotal = (detalles: Array<VentaHistorialDetalleItem | VentaDetalleItem>) =>
  detalles.reduce((acc, detalle) => acc + detalle.subtotal, 0);

const mapVentaHistorial = (value: ApiRecord): VentaHistorialItem => {
  const detalles = asApiRecordArray(value.detalles).map(mapDetalleVenta);

  return {
    ...mapVentaBase(value),
    subtotal: getSubtotal(detalles),
    productosCount: detalles.length,
    detalles,
  };
};

const mapVentaDetalle = (value: ApiRecord): VentaDetalle => {
  const detalles = asApiRecordArray(value.detalles).map(mapDetalleVentaConProducto);

  return {
    ...mapVentaBase(value),
    subtotal: getSubtotal(detalles),
    productosCount: detalles.length,
    usuario: mapVentaUsuario(value.usuario),
    sucursal: mapVentaSucursal(value.sucursal),
    detalles,
  };
};

export const createVenta = async (
  request: SaleRequest
): Promise<SaleResponse> => {
  const response = await fetch(`${settings.URL}/ventas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const payload = (await response.json()) as SaleResponse;

  if (!response.ok) {
    throw new Error("No se pudo registrar la venta");
  }

  return payload;
};

export const listVentas = async (usuarioId?: string): Promise<VentaHistorialItem[]> => {
  const query = new URLSearchParams();

  if (usuarioId) {
    query.set("usuarioId", usuarioId);
  }

  const response = await fetch(
    `${settings.URL}/ventas${query.toString() ? `?${query.toString()}` : ""}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const payload = (await response.json()) as ApiResponse<unknown>;

  if (!response.ok) {
    throw new Error("No se pudo obtener el historial de ventas");
  }

  return asApiRecordArray(payload.data).map(mapVentaHistorial);
};

export const getVentaById = async (id: string): Promise<VentaDetalle> => {
  const response = await fetch(`${settings.URL}/ventas/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as ApiResponse<unknown>;

  if (!response.ok) {
    throw new Error("No se pudo obtener el detalle de la venta");
  }

  return mapVentaDetalle(asApiRecord(payload.data));
};
