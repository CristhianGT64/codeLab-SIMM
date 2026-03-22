import prisma from "../infra/prisma/prismaClient.js";

const ventaRepository = {

  async createVenta(data) {
    return await prisma.venta.create({
      data
    });
  },

  async getVentas({ usuarioId, clienteId }) {

    const where = {};

    if (usuarioId) {
      where.usuarioId = Number(usuarioId);
    }

    if (clienteId) {
      where.clienteId = Number(clienteId);
    }

    return await prisma.venta.findMany({
      where,
      include: {
        detalles: true,
        cliente: true
      },
      orderBy: {
        id: "desc"
      }
    });

  },

  async getVentaById(id) {
    return await prisma.venta.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        detalles: true,
        cliente: true
      }
    });
  }

};

export default ventaRepository;