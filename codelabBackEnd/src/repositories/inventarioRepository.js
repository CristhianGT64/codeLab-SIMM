import prisma from '../infra/prisma/prismaClient.js';

const inventarioSelect = {
  id: true,
  stockActual: true,
  productoId: true,
  sucursalId: true,
};

const alertaSelect = {
  id: true,
  inventarioId: true,
  productoId: true,
  sucursalId: true,
  stockActual: true,
  stockMinimo: true,
  activa: true,
  mensaje: true,
  createdAt: true,
  updatedAt: true,
  resueltaAt: true,
  producto: {
    select: {
      id: true,
      nombre: true,
      sku: true,
      unidadMedida: true,
    },
  },
  sucursal: {
    select: {
      id: true,
      nombre: true,
    },
  },
};

const buildAlertMessage = ({ productoNombre, sucursalNombre, stockActual, stockMinimo }) =>
  `El producto ${productoNombre} en ${sucursalNombre} tiene stock bajo (${stockActual}/${stockMinimo}).`;

const toBigInt = (value) => BigInt(value);

const inventarioRepository = {
  async upsertStock({ productoId, sucursalId, stockActual }) {
    return prisma.inventario.upsert({
      where: {
        productoId_sucursalId: {
          productoId: toBigInt(productoId),
          sucursalId: toBigInt(sucursalId),
        },
      },
      create: {
        productoId: toBigInt(productoId),
        sucursalId: toBigInt(sucursalId),
        stockActual: Number(stockActual),
      },
      update: { stockActual: Number(stockActual) },
      select: inventarioSelect,
    });
  },

  async findProductoById(productoId) {
    return prisma.producto.findUnique({
      where: { id: toBigInt(productoId) },
      select: {
        id: true,
        nombre: true,
        sku: true,
        estado: true,
        costo: true,
        stockMinimo: true,
      },
    });
  },

  async findSucursalById(sucursalId) {
    return prisma.sucursal.findUnique({
      where: { id: toBigInt(sucursalId) },
      select: {
        id: true,
        nombre: true,
        activa: true,
      },
    });
  },

  async findProveedorById(proveedorId) {
    return prisma.proveedor.findUnique({
      where: { id: toBigInt(proveedorId) },
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
          productoId: toBigInt(productoId),
          sucursalId: toBigInt(sucursalId),
        },
      },
      select: inventarioSelect,
    });
  },

  async upsertInventarioEntrada(productoId, sucursalId, cantidad, tx) {
    return tx.inventario.upsert({
      where: {
        productoId_sucursalId: {
          productoId: toBigInt(productoId),
          sucursalId: toBigInt(sucursalId),
        },
      },
      create: {
        productoId: toBigInt(productoId),
        sucursalId: toBigInt(sucursalId),
        stockActual: Number(cantidad),
      },
      update: {
        stockActual: {
          increment: Number(cantidad),
        },
      },
      select: inventarioSelect,
    });
  },

  async updateInventarioSalida(inventarioId, cantidad, tx) {
    return tx.inventario.update({
      where: {
        id: toBigInt(inventarioId),
      },
      data: {
        stockActual: {
          decrement: Number(cantidad),
        },
      },
      select: inventarioSelect,
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
        metodoValuacionAplicado: true,
        costoUnitario: true,
        costoTotal: true,
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

    if (productoId) where.productoId = toBigInt(productoId);
    if (sucursalId) where.sucursalId = toBigInt(sucursalId);
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
        metodoValuacionAplicado: true,
        costoUnitario: true,
        costoTotal: true,
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
        productoId: toBigInt(productoId),
        sucursalId: toBigInt(sucursalId),
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
        metodoValuacionAplicado: true,
        costoUnitario: true,
        costoTotal: true,
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
    await this.syncAlertas(sucursalId);

    const whereInventario = sucursalId ? { sucursalId: toBigInt(sucursalId) } : {};
    const whereMovimientos = sucursalId ? { sucursalId: toBigInt(sucursalId) } : {};
    const whereAlertas = sucursalId ? { sucursalId: toBigInt(sucursalId), activa: true } : { activa: true };

    const hoy = new Date();
    const inicioHoy = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate(), 0, 0, 0, 0));
    const finHoy = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate(), 23, 59, 59, 999));

    const [totalProductos, stockTotalAgg, entradasDelDia, salidasDelDia, alertasActivas, productosBajoStockRows] = await Promise.all([
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
      prisma.alertaInventario.count({
        where: whereAlertas,
      }),
      prisma.alertaInventario.findMany({
        where: whereAlertas,
        distinct: ['productoId'],
        select: { productoId: true },
      }),
    ]);

    return {
      totalProductos,
      stockTotal: stockTotalAgg._sum.stockActual || 0,
      entradasDelDia,
      salidasDelDia,
      alertasActivas,
      productosBajoStock: productosBajoStockRows.length,
    };
  },

  async getMovimientosValuacion(productoId, sucursalId, fechaCorte, tx = prisma) {
    return tx.movimientoInventario.findMany({
      where: {
        productoId: toBigInt(productoId),
        sucursalId: toBigInt(sucursalId),
        fechaMovimiento: {
          lte: fechaCorte,
        },
      },
      orderBy: [
        { fechaMovimiento: 'asc' },
        { id: 'asc' },
      ],
      select: {
        id: true,
        tipo: true,
        cantidad: true,
        costoUnitario: true,
        costoTotal: true,
      },
    });
  },

  async findStock(productoId, sucursalId, tx = prisma) {
    return tx.inventario.findUnique({
      where: {
        productoId_sucursalId: {
          productoId: toBigInt(productoId),
          sucursalId: toBigInt(sucursalId),
        },
      },
      select: inventarioSelect,
    });
  },

  async decreaseStock(productoId, sucursalId, cantidad, tx = prisma) {
    return tx.inventario.update({
      where: {
        productoId_sucursalId: {
          productoId: toBigInt(productoId),
          sucursalId: toBigInt(sucursalId),
        },
      },
      data: {
        stockActual: {
          decrement: Number(cantidad),
        },
      },
      select: inventarioSelect,
    });
  },

  async syncAlertaInventarioById(inventarioId, tx = prisma) {
    const inventario = await tx.inventario.findUnique({
      where: { id: toBigInt(inventarioId) },
      select: {
        id: true,
        stockActual: true,
        productoId: true,
        sucursalId: true,
        producto: {
          select: {
            id: true,
            nombre: true,
            sku: true,
            unidadMedida: true,
            stockMinimo: true,
          },
        },
        sucursal: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    if (!inventario) {
      return null;
    }

    const stockActual = Number(inventario.stockActual);
    const stockMinimo = Number(inventario.producto.stockMinimo || 0);
    const activa = stockActual <= stockMinimo;
    const mensaje = buildAlertMessage({
      productoNombre: inventario.producto.nombre,
      sucursalNombre: inventario.sucursal.nombre,
      stockActual,
      stockMinimo,
    });

    const alertaExistente = await tx.alertaInventario.findUnique({
      where: { inventarioId: inventario.id },
      select: { id: true },
    });

    if (!activa) {
      if (!alertaExistente) {
        return null;
      }

      await tx.alertaInventario.update({
        where: { inventarioId: inventario.id },
        data: {
          activa: false,
          stockActual,
          stockMinimo,
          mensaje,
          resueltaAt: new Date(),
        },
      });

      return null;
    }

    if (alertaExistente) {
      return tx.alertaInventario.update({
        where: { inventarioId: inventario.id },
        data: {
          productoId: inventario.productoId,
          sucursalId: inventario.sucursalId,
          stockActual,
          stockMinimo,
          activa: true,
          mensaje,
          resueltaAt: null,
        },
        select: alertaSelect,
      });
    }

    return tx.alertaInventario.create({
      data: {
        inventarioId: inventario.id,
        productoId: inventario.productoId,
        sucursalId: inventario.sucursalId,
        stockActual,
        stockMinimo,
        activa: true,
        mensaje,
      },
      select: alertaSelect,
    });
  },

  async syncAlertasPorProducto(productoId, tx = prisma) {
    const inventarios = await tx.inventario.findMany({
      where: { productoId: toBigInt(productoId) },
      select: { id: true },
    });

    const alertas = await Promise.all(
      inventarios.map((inventario) => this.syncAlertaInventarioById(inventario.id, tx))
    );

    return alertas.filter(Boolean);
  },

  async syncAlertas(sucursalId, tx = prisma) {
    const inventarios = await tx.inventario.findMany({
      where: {
        ...(sucursalId ? { sucursalId: toBigInt(sucursalId) } : {}),
      },
      select: { id: true },
    });

    await Promise.all(
      inventarios.map((inventario) => this.syncAlertaInventarioById(inventario.id, tx))
    );
  },

  async listProductosBajoStock(sucursalId) {
    const inventarios = await prisma.inventario.findMany({
      where: {
        ...(sucursalId ? { sucursalId: toBigInt(sucursalId) } : {}),
        producto: {
          estado: 'activo',
        },
      },
      orderBy: [
        { stockActual: 'asc' },
        { productoId: 'asc' },
      ],
      select: {
        id: true,
        stockActual: true,
        producto: {
          select: {
            id: true,
            nombre: true,
            sku: true,
            unidadMedida: true,
            stockMinimo: true,
          },
        },
        sucursal: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    return inventarios
      .filter((item) => Number(item.stockActual) <= Number(item.producto.stockMinimo || 0))
      .map((item) => ({
        inventarioId: item.id,
        productoId: item.producto.id,
        producto: item.producto,
        sucursal: item.sucursal,
        stockActual: Number(item.stockActual),
        stockMinimo: Number(item.producto.stockMinimo || 0),
      }));
  },

  async listAlertasActivas(sucursalId) {
    await this.syncAlertas(sucursalId);

    return prisma.alertaInventario.findMany({
      where: {
        activa: true,
        ...(sucursalId ? { sucursalId: toBigInt(sucursalId) } : {}),
      },
      orderBy: [
        { updatedAt: 'desc' },
        { id: 'desc' },
      ],
      select: alertaSelect,
    });
  },
};

export default inventarioRepository;
