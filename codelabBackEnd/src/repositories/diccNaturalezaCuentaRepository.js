import prisma from '../infra/prisma/prismaClient.js';

const diccNaturalezaCuentaSelect = {
  id: true,
  uuidNaturaleza: true,
  nombre: true,
  disponible: true,
};

const diccNaturalezaCuentaRepository = {
  list(filters = {}) {
    const where = {};

    if (typeof filters.disponible === 'boolean') {
      where.disponible = filters.disponible;
    }

    if (filters.search) {
      where.nombre = {
        contains: filters.search,
        mode: 'insensitive',
      };
    }

    return prisma.diccNaturalezaCuenta.findMany({
      where,
      orderBy: [{ nombre: 'asc' }],
      select: diccNaturalezaCuentaSelect,
    });
  },

  findById(id) {
    return prisma.diccNaturalezaCuenta.findUnique({
      where: { id },
      select: diccNaturalezaCuentaSelect,
    });
  },

  findByUuid(uuidNaturaleza) {
    return prisma.diccNaturalezaCuenta.findUnique({
      where: { uuidNaturaleza },
      select: diccNaturalezaCuentaSelect,
    });
  },

  findByNombre(nombre) {
    return prisma.diccNaturalezaCuenta.findFirst({
      where: {
        nombre: {
          equals: nombre,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        uuidNaturaleza: true,
        nombre: true,
        disponible: true,
      },
    });
  },

  create(data) {
    return prisma.diccNaturalezaCuenta.create({
      data,
      select: diccNaturalezaCuentaSelect,
    });
  },

  update(id, data) {
    return prisma.diccNaturalezaCuenta.update({
      where: { id },
      data,
      select: diccNaturalezaCuentaSelect,
    });
  },
};

export default diccNaturalezaCuentaRepository;