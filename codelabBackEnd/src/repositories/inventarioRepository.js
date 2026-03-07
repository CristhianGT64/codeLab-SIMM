import prisma from '../infra/prisma/prismaClient.js';

const inventarioRepository = {
  upsertStock({ productoId, sucursalId, stockActual }) {
    return prisma.inventario.upsert({
      where: { productoId_sucursalId: { productoId, sucursalId } },
      create: { productoId, sucursalId, stockActual },
      update: { stockActual },
      select: { id: true, productoId: true, sucursalId: true, stockActual: true },
    });
  },
};

export default inventarioRepository;