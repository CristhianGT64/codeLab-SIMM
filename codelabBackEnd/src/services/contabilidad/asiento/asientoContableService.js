import prisma from '../../../infra/prisma/prismaClient.js';
import asientoContableRepository from '../../../repositories/contabilidad/asiento/asientoContableRepository.js';
import reglaContableRepository from '../../../repositories/contabilidad/asiento/reglaContableRepository.js';
import periodoContableService from '../../periodoContableService.js';

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const LEFT_MARGIN = 42;
const START_Y = 760;
const LINE_HEIGHT = 14;
const LINES_PER_PAGE = 48;

function buildError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

const normalizePdfText = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, " ")
    .trim();

const escapePdfText = (value) =>
  normalizePdfText(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

const truncate = (value, maxLength) => {
  const text = normalizePdfText(value);

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, Math.max(0, maxLength - 3))}...`;
};

const padCell = (value, width, align = "left") => {
  const text = truncate(value, width);
  return align === "right" ? text.padStart(width, " ") : text.padEnd(width, " ");
};

const formatCurrency = (value) =>
  `L ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) => {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-HN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
};

const getDateFilters = (filters = {}) => {
  const normalized = {};

  if (filters.fechaInicio) {
    normalized.fechaInicio = new Date(`${filters.fechaInicio}T00:00:00.000`);
  }

  if (filters.fechaFin) {
    normalized.fechaFin = new Date(`${filters.fechaFin}T23:59:59.999`);
  }

  return normalized;
};

const getCuentaNombre = (detalle) => {
  const cuenta = detalle.subCuentaContable?.cuentaContable?.nombre;
  const subCuenta = detalle.subCuentaContable?.nombre;

  if (cuenta && subCuenta) {
    return `${cuenta} / ${subCuenta}`;
  }

  return subCuenta || cuenta || `Subcuenta ${detalle.subCuentaContableId}`;
};

const getCuentaCodigo = (detalle) => [
  detalle.subCuentaContable?.elementoContable?.codigoNumerico,
  detalle.subCuentaContable?.clasificacionContable?.codigoNumerico,
  detalle.subCuentaContable?.cuentaContable?.codigoNumerico,
  detalle.subCuentaContable?.codigoNumerico,
].filter((value) => value !== undefined && value !== null).join(".");

const mapAsientoResponse = (asiento) => ({
  ...asiento,
  detalles: (asiento.detalles || []).map((detalle) => ({
    ...detalle,
    cuentaContableNombre: getCuentaNombre(detalle),
    cuentaContableCodigo: getCuentaCodigo(detalle),
  })),
});

const buildPdfLine = (asiento, detalle) => [
  padCell(formatDate(asiento.fecha), 12),
  padCell(asiento.numeroAsiento, 14),
  padCell(detalle.cuentaContableNombre || getCuentaNombre(detalle), 32),
  padCell(formatCurrency(detalle.montoDebe), 14, "right"),
  padCell(formatCurrency(detalle.montoHaber), 14, "right"),
  padCell(detalle.descripcion || asiento.descripcion || "Sin descripcion", 32),
].join(" ");

const paginate = (lines, chunkSize) => {
  const pages = [];

  for (let index = 0; index < lines.length; index += chunkSize) {
    pages.push(lines.slice(index, index + chunkSize));
  }

  return pages.length > 0 ? pages : [[]];
};

const buildPageStream = (lines, pageNumber, totalPages) => {
  const commands = ["BT", "/F1 10 Tf"];

  lines.forEach((line, index) => {
    const y = START_Y - index * LINE_HEIGHT;
    commands.push(`1 0 0 1 ${LEFT_MARGIN} ${y} Tm`);
    commands.push(`(${escapePdfText(line)}) Tj`);
  });

  commands.push(`1 0 0 1 ${LEFT_MARGIN} 28 Tm`);
  commands.push(`(Pagina ${pageNumber} de ${totalPages}) Tj`);
  commands.push("ET");

  return commands.join("\n");
};

const buildPdfBuffer = (pageLines) => {
  const pageObjectIds = [];
  const contentObjectIds = [];
  const objects = [];
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
      body: `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentObjectIds[index]} 0 R >>`,
    });
    objects.push({
      id: contentObjectIds[index],
      body: `<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}\nendstream`,
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
    offsets[object.id] = Buffer.byteLength(pdf, "utf8");
    pdf += `${object.id} 0 obj\n${object.body}\nendobj\n`;
  });

  const xrefStart = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${maxId + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index <= maxId; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${maxId + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "utf8");
};

const buildLibroDiarioPdf = ({ asientos = [], filters = {} }) => {
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
    `Total debe: ${formatCurrency(asientos.reduce((acc, asiento) => acc + Number(asiento.totalDebe || 0), 0))}`,
    `Total haber: ${formatCurrency(asientos.reduce((acc, asiento) => acc + Number(asiento.totalHaber || 0), 0))}`,
    "",
    [
      padCell("Fecha", 12),
      padCell("No. asiento", 14),
      padCell("Cuenta contable", 32),
      padCell("Debito", 14, "right"),
      padCell("Credito", 14, "right"),
      padCell("Descripcion", 32),
    ].join(" "),
    "-----------------------------------------------------------------------------------------------------------------------------",
  ];

  const detailLines = asientos.length > 0
    ? asientos.flatMap((asiento) =>
      asiento.detalles.map((detalle) => buildPdfLine(asiento, detalle)))
    : ["No se encontraron asientos contables para los filtros seleccionados."];

  return buildPdfBuffer(paginate([...headerLines, ...detailLines], LINES_PER_PAGE));
};

const asientoContableService = {

  async generarNumeroAsiento(tx) {

    const ultimo = await tx.asientoContable.findFirst({
      orderBy: { id: "desc" },
      select: { numeroAsiento: true }
    });

    if (!ultimo) return 'AS-000001';

    const numero = parseInt(ultimo.numeroAsiento.split('-')[1]) + 1;

    return `AS-${numero.toString().padStart(6, '0')}`;
  },

  async generarAsiento({
    tipoOperacion,
    idOperacionOrigen,
    descripcion,
    subtotal,
    impuesto,
    total,
    sucursalId,
    fecha = new Date(),
    tx
  }) {

    if (sucursalId) {
      await periodoContableService.assertPeriodoAbierto({
        sucursalId,
        fecha,
        tx: tx || prisma,
      });
    }

    const reglas = await reglaContableRepository.findByOperacion(tipoOperacion);

    if (!reglas.length) {
      throw buildError('No existen reglas contables configuradas.');
    }

    const prismaClient = tx || prisma;
    const numeroAsiento = await this.generarNumeroAsiento(prismaClient);

    const detalles = [];
    let orden = 1;

    let totalDebe = 0;
    let totalHaber = 0;

    const regla = reglas[0];

    const subtotalNum = parseFloat(subtotal);
    const impuestoNum = parseFloat(impuesto || 0);
    const totalNum = parseFloat(total);

    // DEBE (Caja / Banco)
    detalles.push({
      uuidDetalle: `detalle-${tipoOperacion.toLowerCase()}-${idOperacionOrigen}-${orden}`,
      subCuentaContableId: regla.subCuentaDebeId,
      montoDebe: totalNum,
      montoHaber: 0,
      descripcion,
      orden: orden++
    });

    totalDebe += totalNum;

    // HABER (Ventas)
    detalles.push({
      uuidDetalle: `detalle-${tipoOperacion.toLowerCase()}-${idOperacionOrigen}-${orden}`,
      subCuentaContableId: regla.subCuentaHaberId,
      montoDebe: 0,
      montoHaber: subtotalNum,
      descripcion,
      orden: orden++
    });

    totalHaber += subtotalNum;

    // HABER (Impuesto)
    if (impuestoNum > 0 && regla.subCuentaImpuestoId) {

      detalles.push({
        uuidDetalle: `detalle-${tipoOperacion.toLowerCase()}-${idOperacionOrigen}-${orden}`,
        subCuentaContableId: regla.subCuentaImpuestoId,
        montoDebe: 0,
        montoHaber: impuestoNum,
        descripcion,
        orden: orden++
      });

      totalHaber += impuestoNum;

    }

    if (totalDebe !== totalHaber) {
      throw buildError('El asiento no está balanceado.');
    }

    return asientoContableRepository.create({
      uuidAsientoContable: `asiento-${tipoOperacion.toLowerCase()}-${idOperacionOrigen}`,
      numeroAsiento,
      descripcion,
      tipoOperacion,
      idOperacionOrigen,
      totalDebe,
      totalHaber,
      balanceado: true
    }, detalles, tx);

  },

  async list(filters = {}) {
    const normalizedFilters = getDateFilters(filters);
    const data = await asientoContableRepository.findAll(normalizedFilters);
    return data.map(mapAsientoResponse);
  },

  async getById(id) {
    const asiento = await asientoContableRepository.findById(BigInt(id));

    if (!asiento) {
      throw buildError('Asiento contable no encontrado.', 404);
    }

    return mapAsientoResponse(asiento);
  },

  buildPdf(asientos, filters = {}) {
    return buildLibroDiarioPdf({ asientos, filters });
  }

};

export default asientoContableService;
