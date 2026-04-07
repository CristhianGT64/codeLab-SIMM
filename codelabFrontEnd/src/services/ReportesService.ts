import type { VentaHistorialItem } from "../interfaces/POS/IVentasHistorial";
import type {
  ClasificacionContable,
  CuentaContable,
  ElementoContable,
  SubCuentaContable,
} from "../interfaces/CatalogoCuentasContables/CatalogoCuentasContables";
import type {
  LibroDiarioAsiento,
  LibroDiarioDetalle,
  LibroDiarioFilters,
  LibroDiarioMovimiento,
} from "../interfaces/Reportes/LibroDiarioInterface";
import type {
  LibroMayorCuenta,
  LibroMayorFilters,
  LibroMayorMovimiento,
  LibroMayorResponse,
  LibroMayorResumen,
} from "../interfaces/Reportes/LibroMayorInterface";
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

const DIARIO_UNAVAILABLE_STATUS = new Set([404, 405, 501]);

const getLibroDiarioQuery = (filters: LibroDiarioFilters = {}) => {
  const query = new URLSearchParams();

  if (filters.fechaInicio) {
    query.set("fechaInicio", filters.fechaInicio);
  }

  if (filters.fechaFin) {
    query.set("fechaFin", filters.fechaFin);
  }

  return query.toString();
};

const parseLibroDiarioDate = (value?: string, endOfDay = false) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const normalizeLibroDiarioDate = (value: unknown) => {
  const raw = asString(value);

  if (!raw) {
    return null;
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

const getLibroDiarioPayloadMessage = (payload: unknown, fallback: string) =>
  getPayloadMessage(payload) || fallback;

type LibroDiarioCuentaLookup = Record<string, { nombre: string; codigo: string }>;

const mapLibroDiarioMovimiento = (value: ApiRecord): LibroDiarioMovimiento => ({
  id: asString(value.id),
  uuidDetalle: asString(value.uuidDetalle ?? value.uuid_detalle),
  asientoId: asString(value.asientoId ?? value.idAsientoContable ?? value.id_asiento_contable),
  subCuentaContableId: asString(
    value.subCuentaContableId
    ?? value.subcuentaId
    ?? value.idSubCuentaContable
    ?? value.id_sub_cuenta_contable,
  ),
  cuentaContableNombre: asString(
    value.cuentaContableNombre
    ?? value.nombreCuenta
    ?? (isApiRecord(value.subCuentaContable) ? value.subCuentaContable.nombre : ""),
  ),
  cuentaContableCodigo: asString(
    value.cuentaContableCodigo
    ?? value.codigoCuenta
    ?? (isApiRecord(value.subCuentaContable) ? value.subCuentaContable.codigoNumerico : ""),
  ),
  montoDebe: asNumber(value.montoDebe ?? value.debito ?? value.debe),
  montoHaber: asNumber(value.montoHaber ?? value.credito ?? value.haber),
  descripcion: asString(value.descripcion) || null,
  orden: asNumber(value.orden),
});

const sortLibroDiarioMovimientos = (items: LibroDiarioMovimiento[]) =>
  [...items].sort((a, b) => a.orden - b.orden);

const mapLibroDiarioAsiento = (value: ApiRecord): LibroDiarioAsiento => ({
  id: asString(value.id),
  uuidAsientoContable: asString(value.uuidAsientoContable ?? value.uuid_asiento_contable),
  numeroAsiento: asString(value.numeroAsiento ?? value.numero_asiento) || "N/A",
  descripcion: asString(value.descripcion) || null,
  tipoOperacion: asString(value.tipoOperacion ?? value.tipo_operacion),
  idOperacionOrigen: asString(value.idOperacionOrigen ?? value.id_operacion_origen) || null,
  totalDebe: asNumber(value.totalDebe ?? value.debe),
  totalHaber: asNumber(value.totalHaber ?? value.haber),
  balanceado: Boolean(value.balanceado),
  fecha: normalizeLibroDiarioDate(value.fecha),
  detalles: sortLibroDiarioMovimientos(asApiRecordArray(value.detalles).map(mapLibroDiarioMovimiento)),
});

const sortLibroDiarioAsientos = (items: LibroDiarioAsiento[]) =>
  [...items].sort((a, b) => {
    const aTime = a.fecha ? new Date(a.fecha).getTime() : 0;
    const bTime = b.fecha ? new Date(b.fecha).getTime() : 0;

    if (aTime !== bTime) {
      return aTime - bTime;
    }

    return a.numeroAsiento.localeCompare(b.numeroAsiento);
  });

const buildLibroDiarioCuentaLookup = (catalogo: ElementoContable[] = []) =>
  catalogo.reduce<LibroDiarioCuentaLookup>((acc, elemento) => {
    (elemento.clasificaciones ?? []).forEach((clasificacion: ClasificacionContable) => {
      (clasificacion.cuentas ?? []).forEach((cuenta: CuentaContable) => {
        (cuenta.subcuentas ?? []).forEach((subcuenta: SubCuentaContable) => {
          acc[subcuenta.id] = {
            nombre: `${cuenta.nombre} / ${subcuenta.nombre}`,
            codigo: [
              elemento.codigoNumerico,
              clasificacion.codigoNumerico,
              cuenta.codigoNumerico,
              subcuenta.codigoNumerico,
            ].join("."),
          };
        });
      });
    });

    return acc;
  }, {});

const hydrateLibroDiarioAsientos = (
  asientos: LibroDiarioAsiento[],
  cuentaLookup: LibroDiarioCuentaLookup,
) =>
  asientos.map((asiento) => ({
    ...asiento,
    detalles: asiento.detalles.map((detalle) => ({
      ...detalle,
      cuentaContableNombre:
        detalle.cuentaContableNombre
        || cuentaLookup[detalle.subCuentaContableId]?.nombre
        || "Cuenta contable no disponible",
      cuentaContableCodigo:
        detalle.cuentaContableCodigo
        || cuentaLookup[detalle.subCuentaContableId]?.codigo
        || detalle.subCuentaContableId,
    })),
  }));

const applyLibroDiarioFilters = (
  asientos: LibroDiarioAsiento[],
  filters: LibroDiarioFilters = {},
) => {
  const fechaInicio = parseLibroDiarioDate(filters.fechaInicio);
  const fechaFin = parseLibroDiarioDate(filters.fechaFin, true);

  return asientos.filter((asiento) => {
    const fechaAsiento = asiento.fecha ? new Date(asiento.fecha) : null;

    if (fechaInicio && (!fechaAsiento || fechaAsiento < fechaInicio)) {
      return false;
    }

    if (fechaFin && (!fechaAsiento || fechaAsiento > fechaFin)) {
      return false;
    }

    return true;
  });
};

const getLibroDiarioFromResponse = (payload: unknown) => {
  const source = isApiRecord(payload) && "data" in payload ? payload.data : payload;

  if (Array.isArray(source)) {
    return sortLibroDiarioAsientos(asApiRecordArray(source).map(mapLibroDiarioAsiento));
  }

  if (isApiRecord(source) && Array.isArray(source.items)) {
    return sortLibroDiarioAsientos(asApiRecordArray(source.items).map(mapLibroDiarioAsiento));
  }

  return null;
};

const fetchLibroDiarioCollection = async (
  path: string,
  filters: LibroDiarioFilters = {},
) => {
  const query = getLibroDiarioQuery(filters);
  const response = await fetch(`${settings.URL}${path}${query ? `?${query}` : ""}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<unknown> | unknown;

  if (!response.ok) {
    throw {
      status: response.status,
      message: getLibroDiarioPayloadMessage(payload, "No se pudo obtener el libro diario."),
    };
  }

  const mapped = getLibroDiarioFromResponse(payload);

  if (!mapped) {
    throw {
      status: response.status,
      message: "El formato de respuesta del libro diario no es valido.",
    };
  }

  return applyLibroDiarioFilters(mapped, filters);
};

const fetchLibroDiarioItem = async (path: string) => {
  const response = await fetch(`${settings.URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<unknown> | unknown;

  if (!response.ok) {
    throw {
      status: response.status,
      message: getLibroDiarioPayloadMessage(payload, "No se pudo obtener el detalle del asiento."),
    };
  }

  const source = isApiRecord(payload) && "data" in payload ? payload.data : payload;

  if (!isApiRecord(source)) {
    throw {
      status: response.status,
      message: "El formato de respuesta del asiento no es valido.",
    };
  }

  return mapLibroDiarioAsiento(source);
};

const fetchCatalogoContableLookup = async (): Promise<LibroDiarioCuentaLookup> => {
  try {
    const response = await fetch(`${settings.URL}/catalogo-contable/arbol`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return {};
    }

    const payload = (await response.json().catch(() => null)) as ApiResponse<unknown> | unknown;
    const source = isApiRecord(payload) && "data" in payload ? payload.data : payload;

    if (!Array.isArray(source)) {
      return {};
    }

    return buildLibroDiarioCuentaLookup(source as ElementoContable[]);
  } catch {
    return {};
  }
};

const normalizePdfText = (value: unknown) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, " ")
    .trim();

const escapePdfText = (value: unknown) =>
  normalizePdfText(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

const truncatePdfText = (value: unknown, maxLength: number) => {
  const normalized = normalizePdfText(value);
  return normalized.length <= maxLength
    ? normalized
    : `${normalized.slice(0, Math.max(0, maxLength - 3))}...`;
};

const padPdfCell = (value: unknown, width: number, align: "left" | "right" = "left") => {
  const text = truncatePdfText(value, width);
  return align === "right" ? text.padStart(width, " ") : text.padEnd(width, " ");
};

const getPdfByteLength = (value: string) => new TextEncoder().encode(value).length;

const buildLibroDiarioPdfLine = (asiento: LibroDiarioAsiento, movimiento: LibroDiarioMovimiento) =>
  [
    padPdfCell(asiento.fecha ? formatPdfDate(asiento.fecha) : "Sin fecha", 12),
    padPdfCell(asiento.numeroAsiento, 14),
    padPdfCell(
      movimiento.cuentaContableNombre || movimiento.subCuentaContableId || "Cuenta N/A",
      32,
    ),
    padPdfCell(formatPdfCurrency(movimiento.montoDebe), 14, "right"),
    padPdfCell(formatPdfCurrency(movimiento.montoHaber), 14, "right"),
    padPdfCell(movimiento.descripcion || asiento.descripcion || "Sin descripcion", 32),
  ].join(" ");

const paginatePdfLines = (lines: string[], chunkSize: number) => {
  const pages: string[][] = [];

  for (let index = 0; index < lines.length; index += chunkSize) {
    pages.push(lines.slice(index, index + chunkSize));
  }

  return pages.length > 0 ? pages : [[]];
};

const buildPageStream = (lines: string[], pageNumber: number, totalPages: number) => {
  const commands = ["BT", "/F1 10 Tf"];

  lines.forEach((line, index) => {
    const y = 760 - index * 14;
    commands.push(`1 0 0 1 42 ${y} Tm`);
    commands.push(`(${escapePdfText(line)}) Tj`);
  });

  commands.push(`1 0 0 1 42 28 Tm`);
  commands.push(`(Pagina ${pageNumber} de ${totalPages}) Tj`);
  commands.push("ET");

  return commands.join("\n");
};

const buildPdfBlob = (pageLines: string[][]) => {
  const pageObjectIds: number[] = [];
  const contentObjectIds: number[] = [];
  const objects: Array<{ id: number; body: string }> = [];
  let nextId = 3;

  pageLines.forEach(() => {
    pageObjectIds.push(nextId);
    nextId += 1;
    contentObjectIds.push(nextId);
    nextId += 1;
  });

  const fontObjectId = nextId;

  objects.push({ id: 1, body: "<< /Type /Catalog /Pages 2 0 R >>" });
  objects.push({
    id: 2,
    body: `<< /Type /Pages /Count ${pageObjectIds.length} /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] >>`,
  });

  pageLines.forEach((lines, index) => {
    const stream = buildPageStream(lines, index + 1, pageLines.length);
    objects.push({
      id: pageObjectIds[index],
      body: `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentObjectIds[index]} 0 R >>`,
    });
    objects.push({
      id: contentObjectIds[index],
      body: `<< /Length ${getPdfByteLength(stream)} >>\nstream\n${stream}\nendstream`,
    });
  });

  objects.push({
    id: fontObjectId,
    body: "<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>",
  });

  const sortedObjects = objects.sort((a, b) => a.id - b.id);
  const maxId = sortedObjects[sortedObjects.length - 1]?.id ?? 0;
  const offsets = new Array(maxId + 1).fill(0);
  let pdf = "%PDF-1.4\n";

  sortedObjects.forEach((object) => {
    offsets[object.id] = getPdfByteLength(pdf);
    pdf += `${object.id} 0 obj\n${object.body}\nendobj\n`;
  });

  const xrefStart = getPdfByteLength(pdf);
  pdf += `xref\n0 ${maxId + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index <= maxId; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${maxId + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
};

const formatPdfCurrency = (value: number) =>
  `L ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatPdfDate = (value: string) =>
  new Intl.DateTimeFormat("es-HN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));

const buildLibroDiarioPdfFallback = async (filters: LibroDiarioFilters = {}) => {
  const [asientosBase, cuentaLookup] = await Promise.all([
    getLibroDiario(filters),
    fetchCatalogoContableLookup(),
  ]);
  const asientos = hydrateLibroDiarioAsientos(asientosBase, cuentaLookup);
  const generatedAt = new Intl.DateTimeFormat("es-HN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  const headerLines = [
    "SIMM - Libro Diario",
    `Generado: ${generatedAt}`,
    `Rango: ${filters.fechaInicio || "inicio abierto"} a ${filters.fechaFin || "fin abierto"}`,
    `Asientos: ${asientos.length}`,
    `Total debe: ${formatPdfCurrency(asientos.reduce((acc, asiento) => acc + asiento.totalDebe, 0))}`,
    `Total haber: ${formatPdfCurrency(asientos.reduce((acc, asiento) => acc + asiento.totalHaber, 0))}`,
    "",
    [
      padPdfCell("Fecha", 12),
      padPdfCell("No. asiento", 14),
      padPdfCell("Cuenta contable", 32),
      padPdfCell("Debito", 14, "right"),
      padPdfCell("Credito", 14, "right"),
      padPdfCell("Descripcion", 32),
    ].join(" "),
    "-----------------------------------------------------------------------------------------------------------------------------",
  ];

  const detailLines = asientos.length > 0
    ? asientos.flatMap((asiento) =>
      asiento.detalles.map((movimiento) => buildLibroDiarioPdfLine(asiento, movimiento)))
    : ["No se encontraron asientos contables para los filtros seleccionados."];

  const pages = paginatePdfLines([...headerLines, ...detailLines], 48);

  return {
    blob: buildPdfBlob(pages),
    fileName: `libro-diario-${new Date().toISOString().slice(0, 10)}.pdf`,
  };
};

export const getLibroDiario = async (
  filters: LibroDiarioFilters = {},
): Promise<LibroDiarioAsiento[]> => {
  try {
    return await fetchLibroDiarioCollection("/libro-diario", filters);
  } catch (error) {
    if (
      !isApiRecord(error)
      || !("status" in error)
      || !DIARIO_UNAVAILABLE_STATUS.has(asNumber(error.status))
    ) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  try {
    return await fetchLibroDiarioCollection("/asientos-contables", filters);
  } catch (error) {
    if (isApiRecord(error) && "message" in error) {
      throw new Error(asString(error.message) || "No se pudo obtener el libro diario.");
    }

    throw new Error("No se pudo obtener el libro diario.");
  }
};

export const getLibroDiarioDetalle = async (
  asientoId: string,
): Promise<LibroDiarioDetalle> => {
  try {
    return await fetchLibroDiarioItem(`/libro-diario/${encodeURIComponent(asientoId)}`);
  } catch (error) {
    if (
      !isApiRecord(error)
      || !("status" in error)
      || !DIARIO_UNAVAILABLE_STATUS.has(asNumber(error.status))
    ) {
      if (isApiRecord(error) && "message" in error) {
        throw new Error(asString(error.message) || "No se pudo obtener el detalle del asiento.");
      }
    }
  }

  try {
    return await fetchLibroDiarioItem(`/asientos-contables/${encodeURIComponent(asientoId)}`);
  } catch (error) {
    if (isApiRecord(error) && "message" in error) {
      throw new Error(asString(error.message) || "No se pudo obtener el detalle del asiento.");
    }

    throw new Error("No se pudo obtener el detalle del asiento.");
  }
};

export const exportLibroDiarioPdf = async (filters: LibroDiarioFilters = {}) => {
  const query = getLibroDiarioQuery(filters);
  const exportPaths = ["/libro-diario/exportar", "/asientos-contables/exportar"];

  for (const path of exportPaths) {
    try {
      const response = await fetch(`${settings.URL}${path}${query ? `?${query}` : ""}`, {
        method: "GET",
      });

      if (!response.ok) {
        if (DIARIO_UNAVAILABLE_STATUS.has(response.status)) {
          continue;
        }

        const payload = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;
        throw new Error(
          getLibroDiarioPayloadMessage(payload, "No se pudo exportar el libro diario."),
        );
      }

      return {
        blob: await response.blob(),
        fileName:
          response.headers.get("Content-Disposition")?.match(/filename="?([^";]+)"?/i)?.[1]
          ?? "libro-diario.pdf",
      };
    } catch (error) {
      void error;
    }
  }

  return buildLibroDiarioPdfFallback(filters);
};

const LIBRO_MAYOR_UNAVAILABLE_STATUS = new Set([404, 405, 501]);
const LIBRO_MAYOR_ITEMS_KEYS = ["cuentas", "items", "resultados", "reporte", "libroMayor"];
const LIBRO_MAYOR_SUMMARY_KEYS = ["resumen", "summary", "totales", "totals"];
const LIBRO_MAYOR_PERIOD_KEYS = ["periodosContables", "periodos", "periods"];

type LibroMayorMovimientoDraft = Omit<LibroMayorMovimiento, "saldoAcumulado"> & {
  saldoAcumulado: number | null;
};

type LibroMayorCuentaDraft = Omit<LibroMayorCuenta, "movimientos" | "saldoFinal"> & {
  movimientos: LibroMayorMovimientoDraft[];
};

const hasDefinedValue = (value: unknown) =>
  value !== undefined
  && value !== null
  && !(typeof value === "string" && value.trim().length === 0);

const asNullableNumber = (value: unknown) => (hasDefinedValue(value) ? asNumber(value) : null);

const formatPeriodoContable = (value: string) => {
  const [year, month] = value.split("-");

  if (!year || !month) {
    return value;
  }

  return `${year}-${month.padStart(2, "0")}`;
};

const resolvePeriodoContable = (value: unknown) => {
  const raw = asString(value).trim();

  if (/^\d{4}-\d{2}$/.test(raw)) {
    return formatPeriodoContable(raw);
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    return formatPeriodoContable(raw.slice(0, 7));
  }

  return "";
};

const getPeriodoFromIsoDate = (value: string | null) =>
  value ? value.slice(0, 7) : "";

const getLibroMayorQuery = (filters: LibroMayorFilters = {}) => {
  const query = new URLSearchParams();

  if (filters.periodoContable) {
    query.set("periodoContable", filters.periodoContable);
  }

  if (filters.fechaInicio) {
    query.set("fechaInicio", filters.fechaInicio);
  }

  if (filters.fechaFin) {
    query.set("fechaFin", filters.fechaFin);
  }

  return query.toString();
};

const getLibroMayorPath = (filters: LibroMayorFilters = {}) =>
  filters.cuentaId
    ? `/reportes/libro-mayor/cuentas/${encodeURIComponent(filters.cuentaId)}`
    : "/reportes/libro-mayor";

const getLibroMayorItemsSource = (source: unknown) => {
  if (Array.isArray(source)) {
    return source;
  }

  if (!isApiRecord(source)) {
    return null;
  }

  const matchedKey = LIBRO_MAYOR_ITEMS_KEYS.find((key) => key in source);
  return matchedKey ? source[matchedKey] : null;
};

const getLibroMayorSummarySource = (source: unknown) => {
  if (!isApiRecord(source)) {
    return undefined;
  }

  const matchedKey = LIBRO_MAYOR_SUMMARY_KEYS.find((key) => key in source);
  return matchedKey ? source[matchedKey] : source;
};

const getLibroMayorPeriodsSource = (source: unknown) => {
  if (!isApiRecord(source)) {
    return [];
  }

  const matchedKey = LIBRO_MAYOR_PERIOD_KEYS.find((key) => key in source);
  return matchedKey && Array.isArray(source[matchedKey]) ? source[matchedKey] : [];
};

const sortPeriodosContables = (periodos: string[]) =>
  [...new Set(periodos.filter(Boolean).map(formatPeriodoContable))].sort((a, b) => b.localeCompare(a));

const sortLibroMayorMovimientos = (items: LibroMayorMovimientoDraft[]) =>
  [...items].sort((a, b) => {
    const aTime = a.fecha ? new Date(a.fecha).getTime() : 0;
    const bTime = b.fecha ? new Date(b.fecha).getTime() : 0;

    if (aTime !== bTime) {
      return aTime - bTime;
    }

    if ((a.numeroAsiento ?? "") !== (b.numeroAsiento ?? "")) {
      return (a.numeroAsiento ?? "").localeCompare(b.numeroAsiento ?? "");
    }

    return a.orden - b.orden;
  });

const finalizeLibroMayorMovimientos = (
  movimientos: LibroMayorMovimientoDraft[],
  saldoInicial = 0,
): LibroMayorMovimiento[] => {
  let saldo = saldoInicial;

  return sortLibroMayorMovimientos(movimientos).map((movimiento) => {
    saldo = movimiento.saldoAcumulado ?? saldo + movimiento.debito - movimiento.credito;

    return {
      ...movimiento,
      saldoAcumulado: saldo,
    };
  });
};

const mapLibroMayorMovimiento = (value: ApiRecord): LibroMayorMovimientoDraft => ({
  id: asString(value.id ?? value.uuidDetalle ?? value.uuid_detalle),
  fecha: normalizeLibroDiarioDate(value.fecha ?? value.fechaContable ?? value.fechaMovimiento),
  descripcion: asString(value.descripcion ?? value.detalle ?? value.glosa) || null,
  debito: asNumber(value.debito ?? value.montoDebe ?? value.debe),
  credito: asNumber(value.credito ?? value.montoHaber ?? value.haber),
  saldoAcumulado: asNullableNumber(
    value.saldoAcumulado
    ?? value.saldo
    ?? value.balance
    ?? value.saldo_actual,
  ),
  referencia: asString(
    value.referencia
    ?? value.documentoReferencia
    ?? value.tipoOperacion
    ?? value.tipo_operacion,
  ) || null,
  asientoId: asString(
    value.asientoId
    ?? value.idAsientoContable
    ?? value.id_asiento_contable,
  ) || null,
  numeroAsiento: asString(value.numeroAsiento ?? value.numero_asiento) || null,
  orden: asNumber(value.orden ?? value.secuencia ?? value.linea),
});

const getCuentaMovimientosSource = (value: ApiRecord) => {
  if (Array.isArray(value.movimientos)) {
    return value.movimientos;
  }

  if (Array.isArray(value.detalles)) {
    return value.detalles;
  }

  if (Array.isArray(value.items)) {
    return value.items;
  }

  return [];
};

const mapLibroMayorCuenta = (value: ApiRecord): LibroMayorCuenta => {
  const movimientosBase = asApiRecordArray(getCuentaMovimientosSource(value)).map(mapLibroMayorMovimiento);
  const saldoInicial = asNumber(value.saldoInicial ?? value.balanceInicial ?? value.saldo_inicial);
  const movimientos = finalizeLibroMayorMovimientos(movimientosBase, saldoInicial);
  const totalDebitoCalculado = movimientos.reduce((acc, item) => acc + item.debito, 0);
  const totalCreditoCalculado = movimientos.reduce((acc, item) => acc + item.credito, 0);
  const saldoFinal = movimientos.length > 0
    ? movimientos[movimientos.length - 1].saldoAcumulado
    : saldoInicial;

  return {
    cuentaId: asString(
      value.cuentaId
      ?? value.idCuentaContable
      ?? value.idSubCuentaContable
      ?? value.id_sub_cuenta_contable
      ?? value.id,
    ),
    cuentaCodigo: asString(
      value.cuentaCodigo
      ?? value.codigoCuenta
      ?? value.codigo
      ?? value.codigoNumerico,
    ) || "N/A",
    cuentaNombre: asString(
      value.cuentaNombre
      ?? value.nombreCuenta
      ?? value.nombre
      ?? value.descripcionCuenta,
    ) || "Cuenta contable no disponible",
    naturaleza: asString(value.naturaleza ?? value.tipoNaturaleza) || null,
    saldoInicial,
    saldoFinal: asNumber(value.saldoFinal ?? value.balanceFinal ?? value.saldo_final) || saldoFinal,
    totalDebito:
      asNumber(value.totalDebito ?? value.totalDebe ?? value.debito ?? value.debe)
      || totalDebitoCalculado,
    totalCredito:
      asNumber(value.totalCredito ?? value.totalHaber ?? value.credito ?? value.haber)
      || totalCreditoCalculado,
    movimientos,
  };
};

const sortLibroMayorCuentas = (cuentas: LibroMayorCuenta[]) =>
  [...cuentas].sort((a, b) => {
    if (a.cuentaCodigo !== b.cuentaCodigo) {
      return a.cuentaCodigo.localeCompare(b.cuentaCodigo);
    }

    return a.cuentaNombre.localeCompare(b.cuentaNombre);
  });

const buildLibroMayorResumen = (
  cuentas: LibroMayorCuenta[],
  summarySource?: unknown,
): LibroMayorResumen => {
  const source = asApiRecord(summarySource);
  const totalMovimientosCalculado = cuentas.reduce((acc, cuenta) => acc + cuenta.movimientos.length, 0);
  const totalDebitoCalculado = cuentas.reduce((acc, cuenta) => acc + cuenta.totalDebito, 0);
  const totalCreditoCalculado = cuentas.reduce((acc, cuenta) => acc + cuenta.totalCredito, 0);
  const saldoGlobalCalculado = cuentas.reduce((acc, cuenta) => acc + cuenta.saldoFinal, 0);

  return {
    totalCuentas:
      asNumber(source.totalCuentas ?? source.cuentasAnalizadas ?? source.cantidadCuentas)
      || cuentas.length,
    totalMovimientos:
      asNumber(source.totalMovimientos ?? source.movimientos) || totalMovimientosCalculado,
    totalDebito:
      asNumber(source.totalDebito ?? source.totalDebe ?? source.debito ?? source.debe)
      || totalDebitoCalculado,
    totalCredito:
      asNumber(source.totalCredito ?? source.totalHaber ?? source.credito ?? source.haber)
      || totalCreditoCalculado,
    saldoGlobal:
      asNumber(source.saldoGlobal ?? source.balanceGlobal ?? source.saldoFinal)
      || saldoGlobalCalculado,
  };
};

const deriveLibroMayorPeriodos = (cuentas: LibroMayorCuenta[]) =>
  sortPeriodosContables(
    cuentas.flatMap((cuenta) =>
      cuenta.movimientos
        .map((movimiento) => getPeriodoFromIsoDate(movimiento.fecha))
        .filter(Boolean)),
  );

const mapLibroMayorResponse = (payload: unknown): LibroMayorResponse | null => {
  const source = isApiRecord(payload) && "data" in payload ? payload.data : payload;
  const itemsSource = getLibroMayorItemsSource(source);

  if (itemsSource === null) {
    return null;
  }

  const cuentas = sortLibroMayorCuentas(
    asApiRecordArray(itemsSource)
      .map(mapLibroMayorCuenta)
      .filter((cuenta) => Boolean(cuenta.cuentaId) || cuenta.movimientos.length > 0),
  );
  const resumen = buildLibroMayorResumen(cuentas, getLibroMayorSummarySource(source));
  const periodosDisponibles = sortPeriodosContables([
    ...getLibroMayorPeriodsSource(source).map(resolvePeriodoContable),
    ...deriveLibroMayorPeriodos(cuentas),
  ]);

  return {
    cuentas,
    resumen,
    periodosDisponibles,
  };
};

const applyLibroMayorFilters = (
  report: LibroMayorResponse,
  filters: LibroMayorFilters = {},
) => {
  const fechaInicio = parseLibroDiarioDate(filters.fechaInicio);
  const fechaFin = parseLibroDiarioDate(filters.fechaFin, true);
  const periodoContable = filters.periodoContable ? formatPeriodoContable(filters.periodoContable) : "";
  const cuentaId = filters.cuentaId ?? "";

  const cuentas = report.cuentas
    .filter((cuenta) => !cuentaId || cuenta.cuentaId === cuentaId)
    .map((cuenta) => {
      const saldoInicialFiltrado = cuenta.movimientos.reduce((saldo, movimiento) => {
        const fechaMovimiento = movimiento.fecha ? new Date(movimiento.fecha) : null;
        const periodoMovimiento = getPeriodoFromIsoDate(movimiento.fecha);
        const isBeforePeriodo = Boolean(periodoContable && periodoMovimiento < periodoContable);
        const isBeforeFechaInicio = Boolean(fechaInicio && fechaMovimiento && fechaMovimiento < fechaInicio);

        return isBeforePeriodo || isBeforeFechaInicio
          ? movimiento.saldoAcumulado
          : saldo;
      }, cuenta.saldoInicial);

      const movimientosFiltrados = cuenta.movimientos.filter((movimiento) => {
        const fechaMovimiento = movimiento.fecha ? new Date(movimiento.fecha) : null;

        if (fechaInicio && (!fechaMovimiento || fechaMovimiento < fechaInicio)) {
          return false;
        }

        if (fechaFin && (!fechaMovimiento || fechaMovimiento > fechaFin)) {
          return false;
        }

        if (periodoContable && getPeriodoFromIsoDate(movimiento.fecha) !== periodoContable) {
          return false;
        }

        return true;
      });

      const movimientos = finalizeLibroMayorMovimientos(
        movimientosFiltrados.map((movimiento) => ({
          ...movimiento,
          saldoAcumulado: null,
        })),
        saldoInicialFiltrado,
      );

      const totalDebito = movimientos.reduce((acc, item) => acc + item.debito, 0);
      const totalCredito = movimientos.reduce((acc, item) => acc + item.credito, 0);
      const saldoFinal = movimientos.length > 0
        ? movimientos[movimientos.length - 1].saldoAcumulado
        : cuenta.saldoInicial;

      return {
        ...cuenta,
        saldoInicial: saldoInicialFiltrado,
        totalDebito,
        totalCredito,
        saldoFinal,
        movimientos,
      };
    })
    .filter((cuenta) => cuenta.movimientos.length > 0 || !periodoContable);

  return {
    cuentas: sortLibroMayorCuentas(cuentas),
    resumen: buildLibroMayorResumen(cuentas),
    periodosDisponibles: sortPeriodosContables([
      ...report.periodosDisponibles,
      ...deriveLibroMayorPeriodos(cuentas),
      ...(periodoContable ? [periodoContable] : []),
    ]),
  };
};

const fetchLibroMayorCollection = async (
  path: string,
  filters: LibroMayorFilters = {},
) => {
  const query = getLibroMayorQuery(filters);
  const response = await fetch(`${settings.URL}${path}${query ? `?${query}` : ""}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const payload = (await response.json().catch(() => null)) as ApiResponse<unknown> | unknown;

  if (!response.ok) {
    throw {
      status: response.status,
      message: getPayloadMessage(payload) || "No se pudo obtener el libro mayor.",
    };
  }

  const mapped = mapLibroMayorResponse(payload);

  if (!mapped) {
    throw {
      status: response.status,
      message: "El formato de respuesta del libro mayor no es valido.",
    };
  }

  return applyLibroMayorFilters(mapped, filters);
};

const buildLibroMayorFallback = async (
  filters: LibroMayorFilters = {},
): Promise<LibroMayorResponse> => {
  const [asientos, cuentaLookup] = await Promise.all([
    getLibroDiario(),
    fetchCatalogoContableLookup(),
  ]);
  const grouped = new Map<string, LibroMayorCuentaDraft>();
  const fechaInicio = parseLibroDiarioDate(filters.fechaInicio);
  const fechaFin = parseLibroDiarioDate(filters.fechaFin, true);
  const periodoContable = filters.periodoContable ? formatPeriodoContable(filters.periodoContable) : "";

  asientos.forEach((asiento) => {
    asiento.detalles.forEach((detalle) => {
      const cuentaId = detalle.subCuentaContableId || "sin-cuenta";

      if (filters.cuentaId && cuentaId !== filters.cuentaId) {
        return;
      }

      const fechaAsiento = asiento.fecha ? new Date(asiento.fecha) : null;

      if (fechaInicio && (!fechaAsiento || fechaAsiento < fechaInicio)) {
        return;
      }

      if (fechaFin && (!fechaAsiento || fechaAsiento > fechaFin)) {
        return;
      }

      if (periodoContable && getPeriodoFromIsoDate(asiento.fecha) !== periodoContable) {
        return;
      }

      const lookup = cuentaLookup[cuentaId];
      const current = grouped.get(cuentaId) ?? {
        cuentaId,
        cuentaCodigo: detalle.cuentaContableCodigo || lookup?.codigo || cuentaId,
        cuentaNombre:
          detalle.cuentaContableNombre || lookup?.nombre || "Cuenta contable no disponible",
        naturaleza: null,
        saldoInicial: 0,
        totalDebito: 0,
        totalCredito: 0,
        movimientos: [],
      };

      current.movimientos.push({
        id: detalle.id || `${asiento.id}-${detalle.orden}`,
        fecha: asiento.fecha,
        descripcion: detalle.descripcion || asiento.descripcion,
        debito: detalle.montoDebe,
        credito: detalle.montoHaber,
        saldoAcumulado: null,
        referencia: humanizeLibroMayorFallbackReference(asiento.tipoOperacion),
        asientoId: asiento.id,
        numeroAsiento: asiento.numeroAsiento,
        orden: detalle.orden,
      });
      current.totalDebito += detalle.montoDebe;
      current.totalCredito += detalle.montoHaber;
      grouped.set(cuentaId, current);
    });
  });

  const cuentas = sortLibroMayorCuentas(
    Array.from(grouped.values()).map((cuenta) => {
      const movimientos = finalizeLibroMayorMovimientos(cuenta.movimientos, cuenta.saldoInicial);
      const saldoFinal = movimientos.length > 0
        ? movimientos[movimientos.length - 1].saldoAcumulado
        : cuenta.saldoInicial;

      return {
        ...cuenta,
        saldoFinal,
        movimientos,
      };
    }),
  );

  return {
    cuentas,
    resumen: buildLibroMayorResumen(cuentas),
    periodosDisponibles: deriveLibroMayorPeriodos(cuentas),
  };
};

const humanizeLibroMayorFallbackReference = (value: string) => {
  switch (value) {
    case "VENTA":
      return "Venta";
    case "VENTA_COSTO":
      return "Costo de venta";
    case "INVENTARIO_ENTRADA":
      return "Entrada de inventario";
    case "INVENTARIO_DANIO":
      return "Salida por danio";
    case "INVENTARIO_CONSUMO_INTERNO":
      return "Consumo interno";
    case "INVENTARIO_AJUSTE":
      return "Ajuste de inventario";
    case "INVENTARIO_OTRO":
      return "Otro movimiento";
    default:
      return asString(value) || "Movimiento contable";
  }
};

export const getLibroMayorReport = async (
  filters: LibroMayorFilters = {},
): Promise<LibroMayorResponse> => {
  try {
    return await fetchLibroMayorCollection(getLibroMayorPath(filters), filters);
  } catch (error) {
    if (error instanceof TypeError) {
      return buildLibroMayorFallback(filters);
    }

    if (
      isApiRecord(error)
      && "status" in error
      && LIBRO_MAYOR_UNAVAILABLE_STATUS.has(asNumber(error.status))
    ) {
      return buildLibroMayorFallback(filters);
    }

    if (isApiRecord(error) && "message" in error) {
      throw new Error(asString(error.message) || "No se pudo obtener el libro mayor.");
    }

    throw new Error("No se pudo obtener el libro mayor.");
  }
};

const buildLibroMayorPdfLine = (
  cuenta: LibroMayorCuenta,
  movimiento: LibroMayorMovimiento,
) =>
  [
    padPdfCell(movimiento.fecha ? formatPdfDate(movimiento.fecha) : "Sin fecha", 12),
    padPdfCell(movimiento.numeroAsiento || movimiento.referencia || "Referencia", 18),
    padPdfCell(movimiento.descripcion || cuenta.cuentaNombre, 28),
    padPdfCell(formatPdfCurrency(movimiento.debito), 14, "right"),
    padPdfCell(formatPdfCurrency(movimiento.credito), 14, "right"),
    padPdfCell(formatPdfCurrency(movimiento.saldoAcumulado), 14, "right"),
  ].join(" ");

const buildLibroMayorPdfFallback = async (filters: LibroMayorFilters = {}) => {
  const report = await getLibroMayorReport(filters);
  const generatedAt = new Intl.DateTimeFormat("es-HN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
  const headerLines = [
    "SIMM - Libro Mayor",
    `Generado: ${generatedAt}`,
    `Cuenta: ${filters.cuentaId || "Todas las cuentas"}`,
    `Periodo contable: ${filters.periodoContable || "Todos"}`,
    `Rango: ${filters.fechaInicio || "inicio abierto"} a ${filters.fechaFin || "fin abierto"}`,
    `Cuentas: ${report.resumen.totalCuentas} | Movimientos: ${report.resumen.totalMovimientos}`,
    `Debito: ${formatPdfCurrency(report.resumen.totalDebito)} | Credito: ${formatPdfCurrency(report.resumen.totalCredito)}`,
  ];
  const detailLines = report.cuentas.length > 0
    ? report.cuentas.flatMap((cuenta) => [
      "",
      `Cuenta: ${truncatePdfText(`${cuenta.cuentaCodigo} - ${cuenta.cuentaNombre}`, 96)}`,
      `Saldo inicial: ${formatPdfCurrency(cuenta.saldoInicial)} | Saldo final: ${formatPdfCurrency(cuenta.saldoFinal)}`,
      [
        padPdfCell("Fecha", 12),
        padPdfCell("Referencia", 18),
        padPdfCell("Descripcion", 28),
        padPdfCell("Debito", 14, "right"),
        padPdfCell("Credito", 14, "right"),
        padPdfCell("Saldo", 14, "right"),
      ].join(" "),
      "------------------------------------------------------------------------------------------------------------------",
      ...(cuenta.movimientos.length > 0
        ? cuenta.movimientos.map((movimiento) => buildLibroMayorPdfLine(cuenta, movimiento))
        : ["Sin movimientos para esta cuenta."]),
    ])
    : ["", "No se encontraron movimientos para los filtros seleccionados."];
  const pages = paginatePdfLines([...headerLines, ...detailLines], 48);

  return {
    blob: buildPdfBlob(pages),
    fileName: `libro-mayor-${new Date().toISOString().slice(0, 10)}.pdf`,
  };
};

export const exportLibroMayorPdf = async (filters: LibroMayorFilters = {}) => {
  const query = getLibroMayorQuery(filters);
  const exportPaths = ["/reportes/libro-mayor/exportar-pdf"];

  for (const path of exportPaths) {
    try {
      const response = await fetch(`${settings.URL}${path}${query ? `?${query}` : ""}`, {
        method: "GET",
      });

      if (!response.ok) {
        if (LIBRO_MAYOR_UNAVAILABLE_STATUS.has(response.status)) {
          continue;
        }

        const payload = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;
        throw new Error(
          getPayloadMessage(payload) || "No se pudo exportar el libro mayor.",
        );
      }

      return {
        blob: await response.blob(),
        fileName:
          response.headers.get("Content-Disposition")?.match(/filename="?([^";]+)"?/i)?.[1]
          ?? "libro-mayor.pdf",
      };
    } catch (error) {
      if (error instanceof Error && error.message) {
        void error;
      }
    }
  }

  return buildLibroMayorPdfFallback(filters);
};
