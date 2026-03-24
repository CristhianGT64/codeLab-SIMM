import prisma from '../infra/prisma/prismaClient.js';

const elementoContableSelect = {
  id: true,
  uuidElementoContable: true,
  nombre: true,
  disponible: true,
  codigoNumerico: true,
  idNaturaleza: true,
  naturaleza: {
    select: {
      id: true,
      uuidNaturaleza: true,
      nombre: true,
      disponible: true,
    },
  },
};

const elementoContableRepository = {
  list(filters = {}) {
    const where = {};

    if (typeof filters.disponible === 'boolean') {
      where.disponible = filters.disponible;
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

    return prisma.elementoContable.findMany({
      where,
      orderBy: [{ codigoNumerico: 'asc' }, { nombre: 'asc' }],
      select: elementoContableSelect,
    });
  },

  findById(id) {
    return prisma.elementoContable.findUnique({
      where: { id },
      select: elementoContableSelect,
    });
  },

  findByUuid(uuidElementoContable) {
    return prisma.elementoContable.findUnique({
      where: { uuidElementoContable },
      select: elementoContableSelect,
    });
  },

  findByCodigoNumerico(codigoNumerico) {
    return prisma.elementoContable.findUnique({
      where: { codigoNumerico },
      select: {
        id: true,
        uuidElementoContable: true,
        codigoNumerico: true,
        nombre: true,
      },
    });
  },

  create(data) {
    return prisma.elementoContable.create({
      data,
      select: elementoContableSelect,
    });
  },

  update(id, data) {
    return prisma.elementoContable.update({
      where: { id },
      data,
      select: elementoContableSelect,
    });
  },

  count() {
    return prisma.elementoContable.count();
  },
};

export default elementoContableRepository;