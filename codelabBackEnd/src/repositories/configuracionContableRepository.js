import prisma from '../infra/prisma/prismaClient.js';

const configuracionContableRepository = {
  async findFirst() {
    return prisma.configuracionContable.findFirst({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        metodoValuacion: true,
        monedaFuncional: true,
      },
    });
  },

  async create(data) {
    return prisma.configuracionContable.create({
      data,
      select: {
        id: true,
        metodoValuacion: true,
        monedaFuncional: true,
      },
    });
  },

  async update(id, data) {
    return prisma.configuracionContable.update({
      where: { id: BigInt(id) },
      data,
      select: {
        id: true,
        metodoValuacion: true,
        monedaFuncional: true,
      },
    });
  },
};

export default configuracionContableRepository;