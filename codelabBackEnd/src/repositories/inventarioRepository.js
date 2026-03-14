import prisma from '../infra/prisma/prismaClient.js';

const inventarioRepository = {
  async findProductoById(productoId) {
    return prisma.producto.findUnique({
      where: { id: BigInt(productoId) },
      select: {
        id: true,
        nombre: true,
        sku: true,
        estado: true,
      },
    });
  },

  async findSucursalById(sucursalId) {
    return prisma.sucursal.findUnique({
      where: { id: BigInt(sucursalId) },
      select: {
        id: true,
        nombre: true,
        activa: true,
      },
    });
  },

  async findProveedorById(proveedorId) {
    return prisma.proveedor.findUnique({
      where: { id: BigInt(proveedorId) },
      select: {
        id: true,
        nombre: true,
        disponible: true,
      },
    });
  },

  async findInventario(productoId, sucursalId, tx = prisma) {
    return tx.inventario.findUnique({
      where: {
        productoId_sucursalId: {
          productoId: BigInt(productoId),
          sucursalId: BigInt(sucursalId),
        },
      },
      select: {
        id: true,
        stockActual: true,
        productoId: true,
        sucursalId: true,
      },
    });
  },

  async upsertInventarioEntrada(productoId, sucursalId, cantidad, tx) {
    return tx.inventario.upsert({
      where: {
        productoId_sucursalId: {
          productoId: BigInt(productoId),
          sucursalId: BigInt(sucursalId),
        },
      },
      create: {
        productoId: BigInt(productoId),
        sucursalId: BigInt(sucursalId),
        stockActual: Number(cantidad),
      },
      update: {
        stockActual: {
          increment: Number(cantidad),
        },
      },
      select: {
        id: true,
        stockActual: true,
        productoId: true,
        sucursalId: true,
      },
    });
  },

  async updateInventarioSalida(inventarioId, cantidad, tx) {
    return tx.inventario.update({
      where: {
        id: BigInt(inventarioId),
      },
      data: {
        stockActual: {
          decrement: Number(cantidad),
        },
      },
      select: {
        id: true,
        stockActual: true,
        productoId: true,
        sucursalId: true,
      },
    });
  },

  async createMovimiento(data, tx) {
    return tx.movimientoInventario.create({
      data,
      select: {
        id: true,
        tipo: true,
        subtipoEntrada: true,
        motivoSalida: true,
        detalleMotivo: true,
        observaciones: true,
        cantidad: true,
        stockResultante: true,
        fechaMovimiento: true,
        estado: true,
        createdAt: true,
        producto: {
          select: {
            id: true,
            nombre: true,
            sku: true,
          },
        },
        sucursal: {
          select: {
            id: true,
            nombre: true,
          },
        },
        proveedor: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
  },

  async getHistorial(filters) {
    const {
      productoId,
      sucursalId,
      tipo,
      fecha,
      fechaDesde,
      fechaHasta,
    } = filters;

    const where = {};

    if (productoId) where.productoId = BigInt(productoId);
    if (sucursalId) where.sucursalId = BigInt(sucursalId);
    if (tipo) where.tipo = tipo;

    if (fecha) {
      const start = new Date(`${fecha}T00:00:00.000Z`);
      const end = new Date(`${fecha}T23:59:59.999Z`);
      where.fechaMovimiento = { gte: start, lte: end };
    } else if (fechaDesde || fechaHasta) {
      where.fechaMovimiento = {};
      if (fechaDesde) where.fechaMovimiento.gte = new Date(fechaDesde);
      if (fechaHasta) where.fechaMovimiento.lte = new Date(fechaHasta);
    }

    return prisma.movimientoInventario.findMany({
      where,
      orderBy: { fechaMovimiento: 'desc' },
      select: {
        id: true,
        tipo: true,
        subtipoEntrada: true,
        motivoSalida: true,
        detalleMotivo: true,
        observaciones: true,
        cantidad: true,
        stockResultante: true,
        fechaMovimiento: true,
        estado: true,
        producto: {
          select: {
            id: true,
            nombre: true,
            sku: true,
          },
        },
        proveedor: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
  },

  async getHistorialByProducto(productoId, sucursalId) {
    return prisma.movimientoInventario.findMany({
      where: {
        productoId: BigInt(productoId),
        sucursalId: BigInt(sucursalId),
      },
      orderBy: { fechaMovimiento: 'desc' },
      select: {
        id: true,
        tipo: true,
        subtipoEntrada: true,
        motivoSalida: true,
        detalleMotivo: true,
        observaciones: true,
        cantidad: true,
        stockResultante: true,
        fechaMovimiento: true,
        estado: true,
        proveedor: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
  },

  async getDashboardResumen(sucursalId) {
    const whereInventario = sucursalId ? { sucursalId: BigInt(sucursalId) } : {};
    const whereMovimientos = sucursalId ? { sucursalId: BigInt(sucursalId) } : {};

    const hoy = new Date();
    const inicioHoy = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate(), 0, 0, 0, 0));
    const finHoy = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate(), 23, 59, 59, 999));

    const [totalProductos, stockTotalAgg, entradasDelDia, salidasDelDia] = await Promise.all([
      prisma.producto.count({ where: { estado: 'activo' } }),
      prisma.inventario.aggregate({
        where: whereInventario,
        _sum: { stockActual: true },
      }),
      prisma.movimientoInventario.count({
        where: {
          ...whereMovimientos,
          tipo: 'entrada',
          fechaMovimiento: {
            gte: inicioHoy,
            lte: finHoy,
          },
        },
      }),
      prisma.movimientoInventario.count({
        where: {
          ...whereMovimientos,
          tipo: 'salida',
          fechaMovimiento: {
            gte: inicioHoy,
            lte: finHoy,
          },
        },
      }),
    ]);

    return {
      totalProductos,
      stockTotal: stockTotalAgg._sum.stockActual || 0,
      entradasDelDia,
      salidasDelDia,
    };
  },
};

export default inventarioRepository;