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
