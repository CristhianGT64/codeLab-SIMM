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

  async findStock(productoId, sucursalId) {
    return prisma.inventario.findUnique({
      where: {
        productoId_sucursalId: {
          productoId,
          sucursalId
        }
      },
      select: {
        id: true,
        productoId: true,
        sucursalId: true,
        stockActual: true
      }
    });
  },

  async decreaseStock(productoId, sucursalId, cantidad) {
    return prisma.inventario.update({
      where: {
        productoId_sucursalId: {
          productoId,
          sucursalId
        }
      },
      data: {
        stockActual: {
          decrement: cantidad
        }
      }
    });
  }

};

export default inventarioRepository;