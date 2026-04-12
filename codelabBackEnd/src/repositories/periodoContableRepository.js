import prisma from '../infra/prisma/prismaClient.js';

const periodoSelect = {
  id: true,
  sucursalId: true,
  fechaInicio: true,
  fechaFin: true,
  estado: true,
  fechaCierre: true,
  usuarioCierreId: true,
  createdAt: true,
  sucursal: {
    select: {
      id: true,
      nombre: true,
      activa: true,
    },
  },
  usuarioCierre: {
    select: {
      id: true,
      nombreCompleto: true,
      usuario: true,
      rol: {
        select: {
          id: true,
          nombre: true,
        },
      },
    },
  },
};

const buildListWhere = (filters = {}) => {
  const where = {};

  if (filters.sucursalId !== undefined && filters.sucursalId !== null) {
    where.sucursalId = BigInt(filters.sucursalId);
  }

  if (filters.estado) {
    where.estado = filters.estado;
  }

  if (filters.fechaInicio || filters.fechaFin) {
    where.AND = [];

    if (filters.fechaInicio) {
      where.AND.push({
        fechaFin: {
          gte: filters.fechaInicio,
        },
      });
    }

    if (filters.fechaFin) {
      where.AND.push({
        fechaInicio: {
          lte: filters.fechaFin,
        },
      });
    }
  }

  return where;
};

const buildOverlapWhere = ({ sucursalId, fechaInicio, fechaFin, excludeId }) => ({
  sucursalId: BigInt(sucursalId),
  fechaInicio: {
    lte: fechaFin,
  },
  fechaFin: {
    gte: fechaInicio,
  },
  ...(excludeId ? {
    id: {
      not: BigInt(excludeId),
    },
  } : {}),
});

const periodoContableRepository = {
  async existsClosedPeriods() {
    try {
      const count = await prisma.periodoContable.count({
        where: {
          estado: 'CERRADO',
        },
      });

      return count > 0;
    } catch {
      return false;
    }
  },

  async findAll(filters = {}) {
    return prisma.periodoContable.findMany({
      where: buildListWhere(filters),
      select: periodoSelect,
      orderBy: [
        { fechaInicio: 'desc' },
        { id: 'desc' },
      ],
    });
  },

  async findById(id, tx = prisma) {
    return tx.periodoContable.findUnique({
      where: {
        id: BigInt(id),
      },
      select: periodoSelect,
    });
  },

  async findOverlap({ sucursalId, fechaInicio, fechaFin, excludeId }, tx = prisma) {
    return tx.periodoContable.findFirst({
      where: buildOverlapWhere({ sucursalId, fechaInicio, fechaFin, excludeId }),
      select: periodoSelect,
      orderBy: {
        fechaInicio: 'asc',
      },
    });
  },

  async findOpenBySucursalAndDate({ sucursalId, fecha }, tx = prisma) {
    return tx.periodoContable.findFirst({
      where: {
        sucursalId: BigInt(sucursalId),
        estado: 'ABIERTO',
        fechaInicio: {
          lte: fecha,
        },
        fechaFin: {
          gte: fecha,
        },
      },
      select: periodoSelect,
      orderBy: {
        fechaInicio: 'desc',
      },
    });
  },

  async findBySucursalAndDate({ sucursalId, fecha }, tx = prisma) {
    return tx.periodoContable.findFirst({
      where: {
        sucursalId: BigInt(sucursalId),
        fechaInicio: {
          lte: fecha,
        },
        fechaFin: {
          gte: fecha,
        },
      },
      select: periodoSelect,
      orderBy: {
        fechaInicio: 'desc',
      },
    });
  },

  async create(data, tx = prisma) {
    return tx.periodoContable.create({
      data,
      select: periodoSelect,
    });
  },

  async update(id, data, tx = prisma) {
    return tx.periodoContable.update({
      where: {
        id: BigInt(id),
      },
      data,
      select: periodoSelect,
    });
  },

  async findAsientosBySucursalAndRange({ sucursalId, fechaInicio, fechaFin }, tx = prisma) {
    return tx.asientoContable.findMany({
      where: {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin,
        },
        OR: [
          {
            ventas: {
              some: {
                sucursalId: BigInt(sucursalId),
              },
            },
          },
          {
            facturas: {
              some: {
                sucursalId: BigInt(sucursalId),
              },
            },
          },
          {
            movimientosInventario: {
              some: {
                sucursalId: BigInt(sucursalId),
              },
            },
          },
        ],
      },
      select: {
        id: true,
        numeroAsiento: true,
        totalDebe: true,
        totalHaber: true,
        balanceado: true,
        fecha: true,
      },
      orderBy: [
        { fecha: 'asc' },
        { id: 'asc' },
      ],
    });
  },
};

export default periodoContableRepository;
