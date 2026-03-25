function toRangeView(rango) {
  if (!rango) {
    return null;
  }

  return {
    id_rango_emision: rango.id,
    inicio_rango: rango.inicioRango,
    final_rango: rango.finRango,
    id_cai: rango.caiId,
  };
}

function toTipoDocumentoView(tipoDocumento) {
  if (!tipoDocumento) {
    return null;
  }

  return {
    id_tipo_documento: tipoDocumento.id,
    numero: tipoDocumento.numero,
    nombre: tipoDocumento.nombre,
    disponible: tipoDocumento.disponible,
  };
}

function padSegment(value, length) {
  return String(value ?? '').padStart(length, '0');
}

function getPointEmissionContext(cai, ultimaFactura) {
  if (ultimaFactura?.puntoEmision) {
    return ultimaFactura.puntoEmision;
  }

  if (Array.isArray(cai?.rangoEmision?.puntosEmision) && cai.rangoEmision.puntosEmision.length > 0) {
    return (
      cai.rangoEmision.puntosEmision.find((punto) => punto.tipoDocumentoId === cai.tipoDocumentoId) ??
      cai.rangoEmision.puntosEmision[0]
    );
  }

  return null;
}

function formatNumeroFiscal({ establecimientoNumero, puntoEmisionNumero, tipoDocumentoNumero, correlativo }) {
  if (
    establecimientoNumero === undefined ||
    puntoEmisionNumero === undefined ||
    tipoDocumentoNumero === undefined ||
    correlativo === undefined
  ) {
    return null;
  }

  return [
    padSegment(establecimientoNumero, 3),
    padSegment(puntoEmisionNumero, 3),
    padSegment(tipoDocumentoNumero, 2),
    padSegment(correlativo, 8),
  ].join('-');
}

function toUltimaFacturaView(numeroFactura) {
  if (!numeroFactura) {
    return null;
  }

  return {
    id: numeroFactura.id,
    correlativo: numeroFactura.correlativo,
    numeroFormateado: numeroFactura.numeroFormateado,
  };
}

function buildRangoFormateado(cai, ultimaFactura) {
  const puntoEmision = getPointEmissionContext(cai, ultimaFactura);
  const establecimientoNumero = puntoEmision?.establecimientoTipoDocumento?.establecimiento?.numero;
  const puntoEmisionNumero = puntoEmision?.numero;
  const tipoDocumentoNumero =
    puntoEmision?.establecimientoTipoDocumento?.tipoDocumento?.numero ?? cai?.tipoDocumento?.numero;

  const rangoInicio = formatNumeroFiscal({
    establecimientoNumero,
    puntoEmisionNumero,
    tipoDocumentoNumero,
    correlativo: cai?.rangoEmision?.inicioRango,
  });

  const rangoFin = formatNumeroFiscal({
    establecimientoNumero,
    puntoEmisionNumero,
    tipoDocumentoNumero,
    correlativo: cai?.rangoEmision?.finRango,
  });

  if (!rangoInicio || !rangoFin) {
    return null;
  }

  return `${rangoInicio} - ${rangoFin}`;
}

function isAvailable(cai) {
  return cai.activo && new Date(cai.fechaFin) >= new Date();
}

export function toCaiView(cai) {
  if (!cai) {
    return null;
  }

  return {
    id_cai: cai.id,
    codigo: cai.codigo,
    fechaInicio: cai.fechaInicio,
    fechaFin: cai.fechaFin,
    activo: cai.activo,
    tipoDocumentoId: cai.tipoDocumentoId,
    tipoDocumento: toTipoDocumentoView(cai.tipoDocumento),
    rangoEmision: toRangeView(cai.rangoEmision),
  };
}

export function toDetailedCaiView(cai) {
  if (!cai) {
    return null;
  }

  const ultimaFactura = Array.isArray(cai.numerosFactura) ? cai.numerosFactura[0] : null;

  return {
    ...toCaiView(cai),
    ultimaFacturaEmitida: toUltimaFacturaView(ultimaFactura),
    rangoFormateado: buildRangoFormateado(cai, ultimaFactura),
    cantidadFacturasEmitidas: cai._count?.numerosFactura ?? 0,
    disponible: isAvailable(cai),
  };
}
