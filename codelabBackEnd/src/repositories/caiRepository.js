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

const caiRepository = {
  async findByCodigo(codigo) {
    return prisma.cai.findUnique({
      where: { codigo },
      select: {
        id: true,
      },
    });
  },

  async createWithRange(data, options = {}) {
    return prisma.$transaction(async (tx) => {
      const {
        establecimientoId = 1n,
        puntoEmisionNumero = 1,
      } = options;

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
        ...cai,
        rangoEmision: rango,
      };
    });
  },

  async listAllDetailed() {
    return prisma.cai.findMany({
      orderBy: [
        { id: 'desc' },
      ],
      select: caiDetailSelect,
    });
  },

  async findByIdDetailed(id) {
    return prisma.cai.findUnique({
      where: { id: BigInt(id) },
      select: caiDetailSelect,
    });
  },

  async findLatestVigenteDetailed() {
    return prisma.cai.findFirst({
      where: {
        activo: true,
      },
      orderBy: [
        { fechaInicio: 'desc' },
        { id: 'desc' },
      ],
      select: caiDetailSelect,
    });
  },
};

export default caiRepository;
