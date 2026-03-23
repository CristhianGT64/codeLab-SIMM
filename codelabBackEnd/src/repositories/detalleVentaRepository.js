import prisma from "../infra/prisma/prismaClient.js";

const detalleVentaRepository = {

  async createDetalleVenta(data) {
    return await prisma.detalleVenta.create({
      data
    });
  },

  async createManyDetalleVenta(data) {
    return await prisma.detalleVenta.createMany({
      data
    });
  },

  async getDetalleVentaByVentaId(ventaId) {
    return await prisma.detalleVenta.findMany({
      where: {
        ventaId: Number(ventaId)
      },
      include: {
        producto: true
      }
    });
  }

};

export default detalleVentaRepository;