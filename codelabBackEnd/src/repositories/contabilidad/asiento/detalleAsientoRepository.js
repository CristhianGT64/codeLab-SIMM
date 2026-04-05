import prisma from '../../../infra/prisma/prismaClient.js';

const detalleAsientoRepository = {

  async createMany(detalles) {
    return prisma.detalleAsientoContable.createMany({
      data: detalles
    });
  }

};

export default detalleAsientoRepository;