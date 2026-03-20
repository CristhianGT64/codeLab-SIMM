import prisma from "../infra/prisma/prismaClient.js";

const ventaRepository = {

  async createVenta(data) {
    return await prisma.venta.create({
      data
    });
  },

  async getVentas() {
    return await prisma.venta.findMany({
      include: {
        usuario: true,
        cliente: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  },

  async getVentaById(id) {
    return await prisma.venta.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        detalles: {
          include: {
            producto: true
          }
        }
      }
    });
  }

};

export default ventaRepository;