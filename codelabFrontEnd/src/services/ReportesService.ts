import type { VentaHistorialItem } from "../interfaces/POS/IVentasHistorial";
import type {
  ReporteVentasSucursalFilters,
  ReporteVentasSucursalItem,
  ReporteVentasSucursalResponse,
  ReporteVentasSucursalResumen,
} from "../interfaces/Reportes/VentasSucursalReportInterface";
import settings from "../lib/settings";
import { listVentas } from "./PosService";

type ApiRecord = Record<string, unknown>;
type ApiResponse<T> = {
  success?: boolean;
  data?: T;
  message?: string;
};

const REPORT_UNAVAILABLE_STATUS = new Set([404, 405, 501]);
const REPORT_ITEMS_KEYS = ["items", "rows", "resultados", "reporte", "sucursales"];
const REPORT_SUMMARY_KEYS = ["resumen", "summary", "totales", "totals"];

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

const getPayloadMessage = (payload: unknown) => {
  if (!isApiRecord(payload)) {
    return "";
  }

  return asString(payload.message);
};

const getQueryParams = (filters: ReporteVentasSucursalFilters) => {
  const query = new URLSearchParams();

  if (filters.fechaInicio) {
    query.set("fechaInicio", filters.fechaInicio);
  }

  if (filters.fechaFin) {
    query.set("fechaFin", filters.fechaFin);
  }

  filters.sucursalIds?.forEach((sucursalId) => {
    if (sucursalId) {
      query.append("sucursalId", sucursalId);
    }
  });

  return query.toString();
};

const parseInputDate = (value?: string, endOfDay = false) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getVentaUnits = (venta: VentaHistorialItem) => {
  const totalUnidades = venta.detalles.reduce(
    (acc, detalle) => acc + detalle.cantidad,
    0,
  );

  return totalUnidades > 0 ? totalUnidades : venta.productosCount;
};

const buildResumen = (
  items: ReporteVentasSucursalItem[],
  summarySource?: unknown,
): ReporteVentasSucursalResumen => {
  const source = asApiRecord(summarySource);
  const totalVentasCalculado = items.reduce((acc, item) => acc + item.totalVentas, 0);
  const totalTransaccionesCalculado = items.reduce(
    (acc, item) => acc + item.numeroTransacciones,
    0,
  );
  const ingresoTotalCalculado = items.reduce(
    (acc, item) => acc + item.ingresoGenerado,
    0,
  );

  return {
    totalVentasPeriodo:
      asNumber(
        source.totalVentasPeriodo
        ?? source.totalVentas
        ?? source.ventasTotales
        ?? source.totalVentasDelPeriodo,
      ) || totalVentasCalculado,
    totalTransacciones:
      asNumber(
        source.totalTransacciones
        ?? source.numeroTransacciones
        ?? source.transacciones
        ?? source.cantidadTransacciones,
      ) || totalTransaccionesCalculado,
    ingresoTotal:
      asNumber(
        source.ingresoTotal
        ?? source.ingresoGenerado
        ?? source.totalIngresos
        ?? source.montoTotal,
      ) || ingresoTotalCalculado,
    sucursalesAnalizadas:
      asNumber(source.sucursalesAnalizadas ?? source.totalSucursales) || items.length,
  };
};

const mapReporteItem = (value: ApiRecord): ReporteVentasSucursalItem => ({
  sucursalId: asString(value.sucursalId ?? value.id),
  sucursal:
    asString(
      value.sucursal
      ?? value.nombreSucursal
      ?? value.nombre,
    ) || "Sucursal sin nombre",
  numeroTransacciones: asNumber(
    value.numeroTransacciones
    ?? value.totalTransacciones
    ?? value.transacciones
    ?? value.cantidadTransacciones,
  ),
  totalVentas: asNumber(
    value.totalVentas
    ?? value.ventasTotales
    ?? value.cantidadVentas
    ?? value.unidadesVendidas,
  ),
  ingresoGenerado: asNumber(
    value.ingresoGenerado
    ?? value.ingresoTotal
    ?? value.totalIngresos
    ?? value.montoTotal
    ?? value.recaudado,
  ),
});

const getItemsSource = (source: unknown) => {
  if (Array.isArray(source)) {
    return source;
  }

  if (!isApiRecord(source)) {
    return null;
  }

  const matchedKey = REPORT_ITEMS_KEYS.find((key) => key in source);
  return matchedKey ? source[matchedKey] : null;
};

const getSummarySource = (source: unknown) => {
  if (!isApiRecord(source)) {
    return undefined;
  }

  const matchedKey = REPORT_SUMMARY_KEYS.find((key) => key in source);
  return matchedKey ? source[matchedKey] : source;
};

const mapReporteResponse = (source: unknown): ReporteVentasSucursalResponse | null => {
  const itemsSource = getItemsSource(source);

  if (itemsSource === null) {
    return null;
  }

  const items = asApiRecordArray(itemsSource)
    .map(mapReporteItem)
    .sort((a, b) => b.ingresoGenerado - a.ingresoGenerado);

  return {
    items,
    resumen: buildResumen(items, getSummarySource(source)),
  };
};

const matchesFilters = (
  venta: VentaHistorialItem,
  filters: ReporteVentasSucursalFilters,
) => {
  const fechaVenta = venta.createdAt ? new Date(venta.createdAt) : null;
  const fechaInicio = parseInputDate(filters.fechaInicio);
  const fechaFin = parseInputDate(filters.fechaFin, true);

  if (fechaInicio && (!fechaVenta || fechaVenta < fechaInicio)) {
    return false;
  }

  if (fechaFin && (!fechaVenta || fechaVenta > fechaFin)) {
    return false;
  }

  if (
    filters.sucursalIds?.length
    && !filters.sucursalIds.includes(venta.sucursalId)
  ) {
    return false;
  }

  return true;
};

const buildFallbackReport = (
  ventas: VentaHistorialItem[],
): ReporteVentasSucursalResponse => {
  const grouped = ventas.reduce<Map<string, ReporteVentasSucursalItem>>((acc, venta) => {
    const nombreSucursal = venta.nombreSucursal?.trim() || "Sucursal sin nombre";
    const sucursalId = venta.sucursalId || `sin-id-${nombreSucursal}`;
    const current = acc.get(sucursalId) ?? {
      sucursalId,
      sucursal: nombreSucursal,
      numeroTransacciones: 0,
      totalVentas: 0,
      ingresoGenerado: 0,
    };

    current.numeroTransacciones += 1;
    current.totalVentas += getVentaUnits(venta);
    current.ingresoGenerado += venta.total;

    acc.set(sucursalId, current);
    return acc;
  }, new Map<string, ReporteVentasSucursalItem>());

  const items = Array.from(grouped.values()).sort(
    (a, b) => b.ingresoGenerado - a.ingresoGenerado,
  );

  return {
    items,
    resumen: buildResumen(items),
  };
};

const getFallbackVentasSucursalReport = async (
  filters: ReporteVentasSucursalFilters,
) => {
  const ventas = await listVentas();
  const filteredVentas = ventas.filter((venta) => matchesFilters(venta, filters));
  return buildFallbackReport(filteredVentas);
};

export const getVentasSucursalReport = async (
  filters: ReporteVentasSucursalFilters = {},
): Promise<ReporteVentasSucursalResponse> => {
  const query = getQueryParams(filters);

  let response: Response;

  try {
    response = await fetch(
      `${settings.URL}/reportes/ventas/sucursales${query ? `?${query}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch {
    return getFallbackVentasSucursalReport(filters);
  }

  let payload: ApiResponse<unknown> | unknown = null;

  try {
    payload = (await response.json()) as ApiResponse<unknown>;
  } catch {
    if (REPORT_UNAVAILABLE_STATUS.has(response.status)) {
      return getFallbackVentasSucursalReport(filters);
    }

    throw new Error("No se pudo obtener el reporte de ventas por sucursal.");
  }

  if (!response.ok) {
    if (REPORT_UNAVAILABLE_STATUS.has(response.status)) {
      return getFallbackVentasSucursalReport(filters);
    }

    throw new Error(
      getPayloadMessage(payload) || "No se pudo obtener el reporte de ventas por sucursal.",
    );
  }

  const reportFromEndpoint = mapReporteResponse(
    isApiRecord(payload) && "data" in payload ? payload.data : payload,
  );

  if (reportFromEndpoint) {
    return reportFromEndpoint;
  }

  return getFallbackVentasSucursalReport(filters);
};
