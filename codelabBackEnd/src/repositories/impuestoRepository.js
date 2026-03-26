import prisma from '../infra/prisma/prismaClient.js';

const impuestoRepository = {
  list() {
    return prisma.impuesto.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        nombre: true,
        tasa: true,
        activo: true,
      },
    });
  },
};

export default impuestoRepository;
