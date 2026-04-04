import prisma from '../infra/prisma/prismaClient.js';

const impuestoSelect = {
  id: true,
  nombre: true,
  tasa: true,
  activo: true,
};

const impuestoRepository = {
  list() {
    return prisma.impuesto.findMany({
      orderBy: { id: 'asc' },
      select: impuestoSelect,
    });
  },

  findById(id) {
    return prisma.impuesto.findUnique({
      where: { id: BigInt(id) },
      select: impuestoSelect,
    });
  },

  findByNombre(nombre, excludeId) {
    return prisma.impuesto.findFirst({
      where: {
        nombre: {
          equals: nombre,
          mode: 'insensitive',
        },
        ...(excludeId ? { id: { not: BigInt(excludeId) } } : {}),
      },
      select: impuestoSelect,
    });
  },

  create(data) {
    return prisma.impuesto.create({
      data,
      select: impuestoSelect,
    });
  },

  update(id, data) {
    return prisma.impuesto.update({
      where: { id: BigInt(id) },
      data,
      select: impuestoSelect,
    });
  },
};

export default impuestoRepository;
