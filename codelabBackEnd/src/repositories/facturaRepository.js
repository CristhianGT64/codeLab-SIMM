import prisma from "../infra/prisma/prismaClient.js";

const clienteSelect = {
  id: true,
  nombreCompleto: true,
  identificacion: true,
};

const usuarioSelect = {
  id: true,
  nombreCompleto: true,
  usuario: true,
};

const sucursalSelect = {
  id: true,
  nombre: true,
  direccion: true,
};

const detalleFacturaSelect = {
  id: true,
  productoId: true,
  cantidad: true,
  precioUnitario: true,
  subtotal: true,
  tasaImpuesto: true,
  montoImpuesto: true,
  tipoImpuesto: true,
  producto: {
    select: {
      nombre: true,
    },
  },
};

const facturaInclude = {
  detalles: {
    select: detalleFacturaSelect,
  },
  cliente: {
    select: clienteSelect,
  },
  usuario: {
    select: usuarioSelect,
  },
  sucursal: {
    select: sucursalSelect,
  },
  venta: {
    select: {
      id: true,
      estado: true,
    },
  },
  numeroFactura: {
    include: {
      cai: {
        include: {
          rangoEmision: {
            select: {
              inicioRango: true,
              finRango: true,
            },
          },
        },
      },
    },
  },
};

const buildWhere = ({ usuarioId, clienteId, sucursalId, fechaInicio, fechaFin } = {}) => {
  const where = {};

  if (usuarioId !== undefined) {
    where.usuarioId = usuarioId;
  }

  if (clienteId !== undefined) {
    where.clienteId = clienteId;
  }

  if (sucursalId !== undefined) {
    where.sucursalId = sucursalId;
  }

  if (fechaInicio || fechaFin) {
    where.fechaEmision = {};

    if (fechaInicio) {
      where.fechaEmision.gte = fechaInicio;
    }

    if (fechaFin) {
      where.fechaEmision.lte = fechaFin;
    }
  }

  return where;
};

const facturaRepository = {
  async createFactura(data, tx = prisma) {
    return await tx.factura.create({
      data,
    });
  },

  async createDetalleFacturaMany(detalles, tx = prisma) {
    try {
      return await tx.detalleFactura.createMany({
        data: detalles,
      });
    } catch (error) {
      const isDetalleFacturaIdConflict =
        error?.code === "P2002" &&
        Array.isArray(error?.meta?.target) &&
        error.meta.target.includes("id");

      if (!isDetalleFacturaIdConflict) {
        throw error;
      }

      await tx.$executeRaw`
        SELECT setval(
          pg_get_serial_sequence('"DetalleFactura"', 'id'),
          COALESCE((SELECT MAX(id) FROM "DetalleFactura"), 1),
          COALESCE((SELECT MAX(id) IS NOT NULL FROM "DetalleFactura"), false)
        )
      `;

      return await tx.detalleFactura.createMany({
        data: detalles,
      });
    }
  },

  async findFacturaByNumero(numeroFactura) {
    return await prisma.factura.findFirst({
      where: {
        numeroFormateado: numeroFactura,
      },
      include: facturaInclude,
    });
  },

  async findFacturas(filters = {}) {
    return await prisma.factura.findMany({
      where: buildWhere(filters),
      include: facturaInclude,
      orderBy: [
        { fechaEmision: "desc" },
        { id: "desc" },
      ],
    });
  },

  async getLastCorrelativo({
    tipoDocumentoId,
    establecimientoId,
    puntoEmisionId,
    caiId,
  }) {
    const result = await prisma.numeroFactura.aggregate({
      _max: {
        correlativo: true,
      },
      where: {
        tipoDocumentoId: BigInt(tipoDocumentoId),
        establecimientoId: BigInt(establecimientoId),
        puntoEmisionId: BigInt(puntoEmisionId),
        caiId: BigInt(caiId),
      },
    });

    return result._max.correlativo ?? 0;
  },

  async createNumeroFactura(data, tx = prisma) {
    return await tx.numeroFactura.create({
      data,
    });
  },
};

export default facturaRepository;
