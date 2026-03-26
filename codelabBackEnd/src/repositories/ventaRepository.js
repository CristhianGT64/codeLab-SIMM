import prisma from "../infra/prisma/prismaClient.js";

const ventaRepository = {

  // Crear venta (soporta transacción)
  async createVenta(data, tx = prisma) {
  return await tx.venta.create({
    data
  });
},

  // Obtener ventas con filtros
  async getVentas({ usuarioId, clienteId, sucursalId }) {

    const where = {};

    if (usuarioId) {
      where.usuarioId = Number(usuarioId);
    }

    if (clienteId) {
      where.clienteId = Number(clienteId);
    }

    if (sucursalId) {
      where.sucursalId = Number(sucursalId);
    }

    return await prisma.venta.findMany({
      where,
      include: {
        detalles: true,
        cliente: true,
        usuario: true,
        sucursal: true
      },
      orderBy: {
        id: "desc"
      }
    });

  },

  // Obtener venta por ID
  async getVentaById(id) {
    return await prisma.venta.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        detalles: true,
        cliente: true,
        usuario: true,
        sucursal: true
      }
    });
  },

  // Actualizar estado de venta
  async updateEstado(id, estado, tx = prisma) {
    return await tx.venta.update({
      where: {
        id: Number(id)
      },
      data: {
        estado
      }
    });
  }

};

export default ventaRepository;