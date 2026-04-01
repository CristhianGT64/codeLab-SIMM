import prisma from "../../infra/prisma/prismaClient.js";

const clienteSelect = {
  id: true,
  nombreCompleto: true,
  identificacion: true
};

const usuarioSelect = {
  id: true,
  nombreCompleto: true,
  usuario: true
};

const sucursalSelect = {
  id: true,
  nombre: true
};

const detalleVentaListSelect = {
  id: true,
  productoId: true,
  cantidad: true,
  precioUnitario: true,
  subtotal: true
};

const buildWhere = ({ usuarioId, clienteId, sucursalId }) => {
  const where = {};

  if (usuarioId !== undefined && usuarioId !== null && usuarioId !== "") {
    where.usuarioId = BigInt(usuarioId);
  }

  if (clienteId !== undefined && clienteId !== null && clienteId !== "") {
    where.clienteId = BigInt(clienteId);
  }

  if (sucursalId !== undefined && sucursalId !== null && sucursalId !== "") {
    where.sucursalId = BigInt(sucursalId);
  }

  return where;
};

const ventaRepository = {

  async createVenta(data, tx = prisma) {
    return await tx.venta.create({
      data
    });
  },

  async getVentas({ usuarioId, clienteId, sucursalId } = {}) {
    return await prisma.venta.findMany({
      where: buildWhere({ usuarioId, clienteId, sucursalId }),
      select: {
        id: true,
        total: true,
        estado: true,
        createdAt: true,
        clienteId: true,
        usuarioId: true,
        sucursalId: true,
        detalles: {
          select: detalleVentaListSelect
        },
        cliente: {
          select: clienteSelect
        },
        usuario: {
          select: usuarioSelect
        },
        sucursal: {
          select: sucursalSelect
        }
      },
      orderBy: {
        id: "desc"
      }
    });
  },

  async getVentaById(id) {
    return await prisma.venta.findUnique({
      where: {
        id: BigInt(id)
      },
      select: {
        id: true,
        total: true,
        estado: true,
        createdAt: true,
        clienteId: true,
        usuarioId: true,
        sucursalId: true,
        detalles: {
          select: {
            ...detalleVentaListSelect,
            producto: {
              select: {
                id: true,
                nombre: true,
                sku: true,
                precioVenta: true,
                unidadMedida: true
              }
            }
          }
        },
        cliente: {
          select: clienteSelect
        },
        usuario: {
          select: usuarioSelect
        },
        sucursal: {
          select: sucursalSelect
        }
      }
    });
  },

  async updateEstado(id, estado, tx = prisma) {
    return await tx.venta.update({
      where: {
        id: BigInt(id)
      },
      data: {
        estado
      }
    });
  }

};

export default ventaRepository;
