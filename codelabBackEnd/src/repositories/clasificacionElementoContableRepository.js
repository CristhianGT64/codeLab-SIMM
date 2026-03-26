import prisma from '../infra/prisma/prismaClient.js';

const clasificacionElementoContableSelect = {
  id: true,
  uuidClasificacionContable: true,
  nombre: true,
  disponible: true,
  codigoNumerico: true,
  uuidElementoContable: true,
  elementoContable: {
    select: {
      id: true,
      uuidElementoContable: true,
      nombre: true,
      codigoNumerico: true,
      disponible: true,
    },
  },
};

const clasificacionElementoContableRepository = {
  list(filters = {}) {
    const where = {};

    if (typeof filters.disponible === 'boolean') {
      where.disponible = filters.disponible;
    }

    if (filters.uuidElementoContable) {
      where.uuidElementoContable = filters.uuidElementoContable;
    }

    if (filters.search) {
      where.OR = [
        { nombre: { contains: filters.search, mode: 'insensitive' } },
      ];

      const parsedCodigo = Number(filters.search);
      if (!Number.isNaN(parsedCodigo)) {
        where.OR.push({ codigoNumerico: parsedCodigo });
      }
    }

    return prisma.clasificacionElementoContable.findMany({
      where,
      orderBy: [
        { elementoContable: { codigoNumerico: 'asc' } },
        { codigoNumerico: 'asc' },
        { nombre: 'asc' },
      ],
      select: clasificacionElementoContableSelect,
    });
  },

  findById(id) {
    return prisma.clasificacionElementoContable.findUnique({
      where: { id },
      select: clasificacionElementoContableSelect,
    });
  },

  findByUuid(uuidClasificacionContable) {
    return prisma.clasificacionElementoContable.findUnique({
      where: { uuidClasificacionContable },
      select: clasificacionElementoContableSelect,
    });
  },

  findByElementoAndCodigo(uuidElementoContable, codigoNumerico) {
    return prisma.clasificacionElementoContable.findFirst({
      where: {
        uuidElementoContable,
        codigoNumerico,
      },
      select: {
        id: true,
        uuidClasificacionContable: true,
        codigoNumerico: true,
        nombre: true,
        uuidElementoContable: true,
      },
    });
  },

  create(data) {
    return prisma.clasificacionElementoContable.create({
      data,
      select: clasificacionElementoContableSelect,
    });
  },

  update(id, data) {
    return prisma.clasificacionElementoContable.update({
      where: { id },
      data,
      select: clasificacionElementoContableSelect,
    });
  },

  count() {
    return prisma.clasificacionElementoContable.count();
  },
};

export default clasificacionElementoContableRepository;