import ajustesInventarioReportRepository from '../../repositories/reportes/ajustesInventarioReportRepository.js';
import buildAjustesInventarioPdf from './ajustesInventarioPdfService.js';

const TIPOS_AJUSTE = ['PERDIDA', 'DETERIORO', 'SOBRANTE'];

const TIPO_AJUSTE_LABELS = {
  PERDIDA: 'Perdida',
  DETERIORO: 'Deterioro',
  SOBRANTE: 'Sobrante',
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const normalizeText = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase();

const parseProductoId = (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const normalized = String(value).trim();

  if (!/^\d+$/.test(normalized)) {
    const err = new Error('productoId debe ser un identificador numerico valido.');
    err.status = 400;
    throw err;
  }

  return normalized;
};

const parseDate = (value, endOfDay = false, fieldName = 'fecha') => {
  if (!value) {
    return undefined;
  }

  const normalized = String(value).trim();
  const date = new Date(`${normalized}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}`);

  if (Number.isNaN(date.getTime())) {
    const err = new Error(`${fieldName} no tiene un formato valido. Usa YYYY-MM-DD.`);
    err.status = 400;
    throw err;
  }

  return date;
};

const normalizeTipoAjuste = (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const normalized = normalizeText(value);

  if (!TIPOS_AJUSTE.includes(normalized)) {
    const err = new Error('tipoAjuste invalido. Valores permitidos: PERDIDA, DETERIORO, SOBRANTE.');
    err.status = 400;
    throw err;
  }

  return normalized;
};

const resolveTipoAjuste = (movimiento) => {
  if (movimiento.tipoAjuste) {
    return movimiento.tipoAjuste;
  }

  if (movimiento.motivoSalida === 'DANIO') {
    return 'DETERIORO';
  }

  if (movimiento.motivoSalida === 'AJUSTE') {
    return 'PERDIDA';
  }

  return null;
};

const mapProducto = (producto) => ({
  id: String(producto.id),
  nombre: producto.nombre,
  sku: producto.sku,
  unidadMedida: producto.unidadMedida,
});

const mapSucursal = (sucursal) => ({
  id: String(sucursal.id),
  nombre: sucursal.nombre,
});

const mapUsuario = (usuario) =>
  usuario
    ? {
        id: String(usuario.id),
        nombreCompleto: usuario.nombreCompleto,
        usuario: usuario.usuario,
      }
    : null;

const mapAjusteItem = (movimiento) => {
  const tipoAjuste = resolveTipoAjuste(movimiento);

  if (!tipoAjuste) {
    return null;
  }

  const cantidadAjustada = Math.abs(toNumber(movimiento.cantidad, 0));
  const costoUnitario = round2(
    toNumber(movimiento.costoUnitario, toNumber(movimiento.producto?.costo, 0)),
  );
  const impactoBase = movimiento.costoTotal !== null && movimiento.costoTotal !== undefined
    ? Math.abs(toNumber(movimiento.costoTotal, 0))
    : round2(cantidadAjustada * costoUnitario);
  const impactoEconomico = round2(
    impactoBase * (tipoAjuste === 'SOBRANTE' ? 1 : -1),
  );

  return {
    id: String(movimiento.id),
    productoId: String(movimiento.producto.id),
    producto: mapProducto(movimiento.producto),
    sucursal: mapSucursal(movimiento.sucursal),
    usuario: mapUsuario(movimiento.usuario),
    tipoMovimiento: movimiento.tipo,
    cantidadAjustada,
    tipoAjuste,
    tipoAjusteLabel: TIPO_AJUSTE_LABELS[tipoAjuste],
    fechaAjuste: movimiento.fechaMovimiento,
    costoUnitario,
    impactoEconomico,
    impactoEconomicoAbsoluto: round2(Math.abs(impactoBase)),
    detalleMotivo: movimiento.detalleMotivo,
    observaciones: movimiento.observaciones,
    stockResultante: movimiento.stockResultante,
    referenciaTipo: movimiento.referenciaTipo,
  };
};

const createTypeSummary = () => ({
  cantidadAjustes: 0,
  impactoEconomico: 0,
});

const buildResumen = (items) => {
  const resumen = {
    totalRegistros: items.length,
    totalCantidadAjustada: 0,
    impactoTotal: 0,
    impactoNegativoTotal: 0,
    impactoPositivoTotal: 0,
    porTipo: {
      PERDIDA: createTypeSummary(),
      DETERIORO: createTypeSummary(),
      SOBRANTE: createTypeSummary(),
    },
  };

  items.forEach((item) => {
    resumen.totalCantidadAjustada += item.cantidadAjustada;
    resumen.impactoTotal = round2(resumen.impactoTotal + item.impactoEconomico);

    if (item.impactoEconomico < 0) {
      resumen.impactoNegativoTotal = round2(
        resumen.impactoNegativoTotal + item.impactoEconomico,
      );
    } else {
      resumen.impactoPositivoTotal = round2(
        resumen.impactoPositivoTotal + item.impactoEconomico,
      );
    }

    const bucket = resumen.porTipo[item.tipoAjuste];
    bucket.cantidadAjustes += 1;
    bucket.impactoEconomico = round2(
      bucket.impactoEconomico + item.impactoEconomico,
    );
  });

  resumen.totalCantidadAjustada = round2(resumen.totalCantidadAjustada);

  return resumen;
};

const normalizeFilters = (query = {}) => {
  const fechaInicio = parseDate(query.fechaInicio, false, 'fechaInicio');
  const fechaFin = parseDate(query.fechaFin, true, 'fechaFin');

  if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
    const err = new Error('fechaInicio no puede ser mayor a fechaFin.');
    err.status = 400;
    throw err;
  }

  return {
    productoId: parseProductoId(query.productoId),
    fechaInicio,
    fechaFin,
    tipoAjuste: normalizeTipoAjuste(query.tipoAjuste),
  };
};

const buildFiltersResponse = (query = {}, normalizedFilters = {}) => ({
  productoId: normalizedFilters.productoId || null,
  fechaInicio: query.fechaInicio || null,
  fechaFin: query.fechaFin || null,
  tipoAjuste: normalizedFilters.tipoAjuste || null,
});

const ajustesInventarioReportService = {
  async list(query = {}) {
    const normalizedFilters = normalizeFilters(query);
    const movimientos = await ajustesInventarioReportRepository.findAjustes(normalizedFilters);
    const items = movimientos
      .map(mapAjusteItem)
      .filter(Boolean);

    return {
      items,
      resumen: buildResumen(items),
      filtrosAplicados: buildFiltersResponse(query, normalizedFilters),
    };
  },

  buildPdf(reportData) {
    return buildAjustesInventarioPdf({
      items: reportData.items,
      resumen: reportData.resumen,
      filters: reportData.filtrosAplicados,
    });
  },
};

export default ajustesInventarioReportService;
