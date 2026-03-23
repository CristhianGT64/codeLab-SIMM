import prisma from '../infra/prisma/prismaClient.js';

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
    },
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

const caiRepository = {
  async findLastByFechaFin() {
    const cai = await prisma.cai.findFirst({
      orderBy: [
        { fechaFin: 'desc' },
        { id: 'desc' },
      ],
      select: caiSelect,
    });

    return toCaiView(cai);
  },

  async findLastRangeByFinal() {
    const rango = await prisma.rangoEmision.findFirst({
      orderBy: [
        { finRango: 'desc' },
        { id: 'desc' },
      ],
      select: {
        id: true,
        inicioRango: true,
        finRango: true,
        caiId: true,
      },
    });

    return toRangeView(rango);
  },

  async findByCodigo(codigo) {
    const cai = await prisma.cai.findUnique({
      where: { codigo },
      select: {
        id: true,
      },
    });

    return cai;
  },

  async createWithRange(data) {
    return prisma.$transaction(async (tx) => {
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

      return {
        ...toCaiView(cai),
        rangoEmision: toRangeView(rango),
      };
    });
  },

  async listAll() {
    const cais = await prisma.cai.findMany({
      orderBy: [
        { fechaInicio: 'desc' },
        { id: 'desc' },
      ],
      select: {
        ...caiSelect,
        numerosFactura: true,
      },
    });

    return cais.map((cai) => {
      const caiView = toCaiView(cai);
      let cantidadFacturasEmitidas = 0;

      if (cai && cai.numerosFactura && Array.isArray(cai.numerosFactura)) {
        cantidadFacturasEmitidas = cai.numerosFactura.length;
      }

      return {
        ...caiView,
        cantidadFacturasEmitidas,
      };
    });
  },

  async findLatestVigente() {
    const cai = await prisma.cai.findFirst({
      where: {
        activo: true,
      },
      orderBy: [{ id: 'desc' }],
      select: {
        ...caiSelect,
        numerosFactura: true,
      },
    });

    if (!cai) {
      return null;
    }

    const caiView = toCaiView(cai);
    let cantidadFacturasEmitidas = 0;

    if (Array.isArray(cai.numerosFactura)) {
      cantidadFacturasEmitidas = cai.numerosFactura.length;
    }

    return {
      ...caiView,
      cantidadFacturasEmitidas,
    };
  },
};

export default caiRepository;
