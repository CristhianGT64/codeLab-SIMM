import prisma from "../infra/prisma/prismaClient.js";

const detalleVentaRepository = {

  async createManyDetalleVenta(detalles, tx = prisma) {
    return await tx.detalleVenta.createMany({
      data: detalles
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