const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const LEFT_MARGIN = 42;
const START_Y = 760;
const LINE_HEIGHT = 14;
const LINES_PER_PAGE = 48;

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

const buildLine = (factura) => [
  padCell(factura.numeroFactura || "N/A", 18),
  padCell(formatDate(factura.fechaEmision), 12),
  padCell(factura.cliente?.nombre || "Consumidor Final", 22),
  padCell(factura.sucursal?.nombre || "Sucursal N/A", 20),
  padCell(formatCurrency(factura.totales?.total ?? 0), 16, "right"),
  padCell(String(factura.estadoFactura || "pagada").toUpperCase(), 10),
].join(" ");

const paginate = (lines, chunkSize) => {
  const pages = [];

  for (let index = 0; index < lines.length; index += chunkSize) {
    pages.push(lines.slice(index, index + chunkSize));
  }

  return pages.length > 0 ? pages : [[]];
};

const buildPageStream = (lines, pageNumber, totalPages) => {
  const commands = [
    "BT",
    "/F1 10 Tf",
  ];

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

  objects.push({
    id: 1,
    body: "<< /Type /Catalog /Pages 2 0 R >>",
  });

  objects.push({
    id: 2,
    body: `<< /Type /Pages /Count ${pageObjectIds.length} /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] >>`,
  });

  pageLines.forEach((lines, index) => {
    const stream = buildPageStream(lines, index + 1, pageLines.length);
    const pageObjectId = pageObjectIds[index];
    const contentObjectId = contentObjectIds[index];

    objects.push({
      id: pageObjectId,
      body: `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentObjectId} 0 R >>`,
    });

    objects.push({
      id: contentObjectId,
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

const buildFiltersSummary = (filters) => {
  const rangoFechas = filters.fechaInicio || filters.fechaFin
    ? `${filters.fechaInicio || "inicio abierto"} a ${filters.fechaFin || "fin abierto"}`
    : "Todas las fechas";

  return [
    `Cliente: ${filters.clienteId || "Todos"}`,
    `Sucursal: ${filters.sucursalId || "Todas"}`,
    `Rango: ${rangoFechas}`,
  ];
};

const buildTotalsSummary = (facturas) => {
  const totalFacturado = facturas.reduce(
    (acc, factura) => acc + Number(factura.totales?.total ?? 0),
    0,
  );

  return [
    `Facturas encontradas: ${facturas.length}`,
    `Monto total: ${formatCurrency(totalFacturado)}`,
  ];
};

const buildFacturaHistoryPdf = ({ facturas = [], filters = {} }) => {
  const generatedAt = new Intl.DateTimeFormat("es-HN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  const headerLines = [
    "SIMM - Historial de Facturacion",
    `Generado: ${generatedAt}`,
    ...buildFiltersSummary(filters),
    ...buildTotalsSummary(facturas),
    "",
    [
      padCell("No. Factura", 18),
      padCell("Fecha", 12),
      padCell("Cliente", 22),
      padCell("Sucursal", 20),
      padCell("Total", 16, "right"),
      padCell("Estado", 10),
    ].join(" "),
    "---------------------------------------------------------------------------------------------------------------",
  ];

  const detailLines = facturas.length > 0
    ? facturas.map(buildLine)
    : ["No se encontraron facturas para los filtros seleccionados."];

  const pages = paginate([...headerLines, ...detailLines], LINES_PER_PAGE);
  return buildPdfBuffer(pages);
};

export default buildFacturaHistoryPdf;
