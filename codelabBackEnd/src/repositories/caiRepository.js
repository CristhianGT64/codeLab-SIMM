import prisma from '../infra/prisma/prismaClient.js';

const puntoEmisionSelect = {
  id: true,
  numero: true,
  tipoDocumentoId: true,
  establecimientoId: true,
  establecimientoTipoDocumento: {
    select: {
      establecimiento: {
        select: {
          id: true,
          numero: true,
          nombre: true,
        },
      },
      tipoDocumento: {
        select: {
          id: true,
          numero: true,
          nombre: true,
        },
      },
    },
  },
};

const latestNumeroFacturaSelect = {
  id: true,
  numeroFormateado: true,
  correlativo: true,
  tipoDocumentoId: true,
  establecimientoId: true,
  puntoEmisionId: true,
  puntoEmision: {
    select: puntoEmisionSelect,
  },
};

const caiSelect = {
  id: true,
  codigo: true,
  fechaInicio: true,
  fechaFin: true,
  activo: true,
  tipoDocumentoId: true,
  tipoDocumento: {
    select: {
      id: true,
      numero: true,
      nombre: true,
      disponible: true,
    },
  },
  rangoEmision: {
    select: {
      id: true,
      inicioRango: true,
      finRango: true,
      caiId: true,
      puntosEmision: {
        select: puntoEmisionSelect,
        orderBy: {
          id: 'asc',
        },
      },
    },
  },
};

const caiDetailSelect = {
  ...caiSelect,
  _count: {
    select: {
      numerosFactura: true,
    },
  },
  numerosFactura: {
    select: latestNumeroFacturaSelect,
    orderBy: [
      { correlativo: 'desc' },
      { id: 'desc' },
    ],
    take: 1,
  },
};

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

function toCaiView(cai) {
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

function toDetailedCaiView(cai) {
  if (!cai) {
    return null;
  }

  const ultimaFactura = Array.isArray(cai.numerosFactura) ? cai.numerosFactura[0] : null;

  return {
    ...toCaiView(cai),
    ultimaFacturaEmitida: toUltimaFacturaView(ultimaFactura),
    rangoFormateado: buildRangoFormateado(cai, ultimaFactura),
    cantidadFacturasEmitidas: cai._count?.numerosFactura ?? 0,
  };
}

const caiRepository = {
  async findByCodigo(codigo) {
    return prisma.cai.findUnique({
      where: { codigo },
      select: {
        id: true,
      },
    });
  },

  async createWithRange(data) {
    return prisma.$transaction(async (tx) => {
      const establecimientoId = 1n;
      const puntoEmisionNumero = 1;

      const cai = await tx.cai.create({
        data: {
          codigo: data.codigo,
          fechaInicio: data.fechaInicio,
          fechaFin: data.fechaFin,
          activo: true,
          tipoDocumentoId: data.tipoDocumentoId,
        },
        select: caiSelect,
      });

      const rango = await tx.rangoEmision.create({
        data: {
          inicioRango: data.inicioRango,
          finRango: data.finalRango,
          caiId: cai.id,
        },
        select: {
          id: true,
          inicioRango: true,
          finRango: true,
          caiId: true,
        },
      });

      await tx.establecimientoTipoDocumento.upsert({
        where: {
          establecimientoId_tipoDocumentoId: {
            establecimientoId,
            tipoDocumentoId: data.tipoDocumentoId,
          },
        },
        create: {
          establecimientoId,
          tipoDocumentoId: data.tipoDocumentoId,
          disponible: true,
        },
        update: {
          disponible: true,
        },
      });

      await tx.puntoEmision.upsert({
        where: {
          numero_establecimientoId_tipoDocumentoId: {
            numero: puntoEmisionNumero,
            establecimientoId,
            tipoDocumentoId: data.tipoDocumentoId,
          },
        },
        create: {
          numero: puntoEmisionNumero,
          establecimientoId,
          tipoDocumentoId: data.tipoDocumentoId,
          rangoEmisionId: rango.id,
          disponible: true,
        },
        update: {
          rangoEmisionId: rango.id,
          disponible: true,
        },
      });

      return {
        ...toCaiView(cai),
        rangoEmision: toRangeView(rango),
      };
    });
  },

  async listAll() {
    const cais = await prisma.cai.findMany({
      orderBy: [
        { id: 'desc' },
      ],
      select: caiDetailSelect,
    });

    return cais.map(toDetailedCaiView);
  },

  async findByIdDetailed(id) {
    const cai = await prisma.cai.findUnique({
      where: { id: BigInt(id) },
      select: caiDetailSelect,
    });

    return toDetailedCaiView(cai);
  },

  async findLatestVigenteDetailed() {
    const cai = await prisma.cai.findFirst({
      where: {
        activo: true,
      },
      orderBy: [
        { fechaInicio: 'desc' },
        { id: 'desc' },
      ],
      select: caiDetailSelect,
    });

    return toDetailedCaiView(cai);
  },
};

export default caiRepository;
