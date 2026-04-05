import prisma from '../infra/prisma/prismaClient.js';
import productoRepository from '../repositories/productoRepository.js';
import inventarioRepository from '../repositories/inventarioRepository.js';

const UNIDADES_VALIDAS = [
  'Unidad',
  'Kilogramo',
  'Gramo',
  'Litro',
  'Metro',
  'Caja',
  'Paquete',
  'Docena',
];

const parseStockMinimo = (value) => {
  if (value === undefined || value === null || value === '') {
    return 0;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    const err = new Error('stockMinimo debe ser un número entero mayor o igual a 0.');
    err.status = 400;
    throw err;
  }

  return parsed;
};

const productoService = {
  async create(body) {
    const {
      nombre,
      sku,
      categoriaId,
      costo,
      precioVenta,
      unidadMedida,
      stockInicial,
      stockMinimo,
      imagenPath,
      sucursalId,
      impuestoId, 
    } = body;

    if (
      !nombre ||
      !sku ||
      !categoriaId ||
      costo === undefined ||
      precioVenta === undefined ||
      !unidadMedida ||
      stockInicial === undefined ||
      !impuestoId 
    ) {
      const err = new Error(
        'Faltan campos obligatorios: nombre, sku, categoriaId, costo, precioVenta, unidadMedida, stockInicial, impuestoId'
      );
      err.status = 400;
      throw err;
    }

    if (!Number.isInteger(Number(stockInicial)) || Number(stockInicial) < 0) {
      const err = new Error('stockInicial debe ser un número entero mayor o igual a 0.');
      err.status = 400;
      throw err;
    }

    const stockMinimoFinal = parseStockMinimo(stockMinimo);

    if (!UNIDADES_VALIDAS.includes(unidadMedida)) {
      const err = new Error(`unidadMedida inválida. Valores permitidos: ${UNIDADES_VALIDAS.join(', ')}`);
      err.status = 400;
      throw err;
    }

    if (Number(precioVenta) <= Number(costo)) {
      const err = new Error('El precio de venta debe ser mayor al costo del producto.');
      err.status = 400;
      throw err;
    }

    const dup = await productoRepository.findBySku(sku);
    if (dup) {
      const err = new Error('El SKU ya está registrado.');
      err.status = 409;
      throw err;
    }

    //Validar categoría
    const cat = await prisma.categoria.findUnique({
      where: { id: BigInt(categoriaId) },
      select: { id: true, disponible: true },
    });

    if (!cat) {
      const err = new Error('La categoría asignada no existe.');
      err.status = 400;
      throw err;
    }

    if (cat.disponible === false) {
      const err = new Error('La categoría asignada está deshabilitada.');
      err.status = 400;
      throw err;
    }

    //Validar impuesto
    const impuesto = await prisma.impuesto.findUnique({
      where: { id: BigInt(impuestoId) },
      select: { id: true, activo: true },
    });

    if (!impuesto) {
      const err = new Error('El impuesto asignado no existe.');
      err.status = 400;
      throw err;
    }

    if (impuesto.activo === false) {
      const err = new Error('El impuesto asignado está inactivo.');
      err.status = 400;
      throw err;
    }

    let sucursalFinalId;

    if (sucursalId) {
      const suc = await prisma.sucursal.findUnique({
        where: { id: BigInt(sucursalId) },
        select: { id: true, activa: true },
      });

      if (!suc) {
        const err = new Error('La sucursal asignada no existe.');
        err.status = 400;
        throw err;
      }

      if (suc.activa === false) {
        const err = new Error('La sucursal asignada está inactiva.');
        err.status = 400;
        throw err;
      }

      sucursalFinalId = BigInt(sucursalId);
    } else {
      const sucDefault = await prisma.sucursal.findFirst({
        where: { activa: true },
        orderBy: { id: 'asc' },
        select: { id: true },
      });

      if (!sucDefault) {
        const err = new Error('No hay sucursales activas.');
        err.status = 400;
        throw err;
      }

      sucursalFinalId = sucDefault.id;
    }

    const result = await prisma.$transaction(async (tx) => {
      const producto = await tx.producto.create({
        data: {
          nombre,
          sku,
          costo,
          precioVenta,
          unidadMedida,
          stockMinimo: stockMinimoFinal,
          imagenPath: imagenPath || null,
          estado: 'activo',
          categoriaId: BigInt(categoriaId),
          impuestoId: BigInt(impuestoId), 
        },
        select: {
          id: true,
          nombre: true,
          sku: true,
          costo: true,
          precioVenta: true,
          unidadMedida: true,
          stockMinimo: true,
          imagenPath: true,
          estado: true,
          categoria: { select: { id: true, nombre: true } },
          impuesto: { select: { id: true, nombre: true, tasa: true } },
        },
      });

      const inventario = await tx.inventario.upsert({
        where: {
          productoId_sucursalId: {
            productoId: producto.id,
            sucursalId: sucursalFinalId,
          },
        },
        create: {
          productoId: producto.id,
          sucursalId: sucursalFinalId,
          stockActual: Number(stockInicial),
        },
        update: {
          stockActual: Number(stockInicial),
        },
      });

      if (Number(stockInicial) > 0) {
        await tx.movimientoInventario.create({
          data: {
            tipo: 'entrada',
            subtipoEntrada: 'PRODUCTO_NUEVO',
            cantidad: Number(stockInicial),
            stockResultante: Number(stockInicial),
            fechaMovimiento: new Date(),
            estado: 'completado',
            referenciaTipo: 'creacion_producto',
            productoId: producto.id,
            sucursalId: sucursalFinalId,
          },
        });
      }

      await inventarioRepository.syncAlertaInventarioById(inventario.id, tx);

      return { producto, inventario };
    });

    return result;
  },

  list() {
    return productoRepository.list();
  },

  async getById(idParam) {
    const id = BigInt(idParam);
    const prod = await productoRepository.findById(id);
    if (!prod) throw new Error('Producto no encontrado.');
    return prod;
  },

  async searchProducts(query) {
    if (!query) throw new Error("Query requerida");
    return productoRepository.search(query);
  },

  async update(idParam, body = {}) {
    const id = BigInt(idParam);

    const current = await productoRepository.findById(id);
    if (!current) throw new Error('Producto no encontrado.');

    if (body.impuestoId !== undefined) {
      const impuesto = await prisma.impuesto.findUnique({
        where: { id: BigInt(body.impuestoId) },
      });

      if (!impuesto || !impuesto.activo) {
        throw new Error('Impuesto inválido o inactivo');
      }
    }

    const data = {};

    if (body.nombre !== undefined) data.nombre = body.nombre;
    if (body.costo !== undefined) data.costo = body.costo;
    if (body.precioVenta !== undefined) data.precioVenta = body.precioVenta;
    if (body.unidadMedida !== undefined) data.unidadMedida = body.unidadMedida;
    if (body.categoriaId !== undefined) data.categoriaId = BigInt(body.categoriaId);
    if (body.imagenPath !== undefined) data.imagenPath = body.imagenPath;
    if (body.impuestoId !== undefined) data.impuestoId = BigInt(body.impuestoId); 
    if (body.stockMinimo !== undefined) data.stockMinimo = parseStockMinimo(body.stockMinimo);

    const updated = await productoRepository.update(id, data);
    await inventarioRepository.syncAlertasPorProducto(id);
    return updated;
  },

  async updateStockMinimo(idParam, stockMinimo) {
    const id = BigInt(idParam);
    const current = await productoRepository.findById(id);

    if (!current) {
      const err = new Error('Producto no encontrado.');
      err.status = 404;
      throw err;
    }

    const updated = await productoRepository.update(id, {
      stockMinimo: parseStockMinimo(stockMinimo),
    });

    await inventarioRepository.syncAlertasPorProducto(id);

    return updated;
  },

  async patchEstado(idParam, { estado }) {
    const id = BigInt(idParam);
    return productoRepository.update(id, { estado });
  },

  async remove(idParam) {
    await this.patchEstado(idParam, { estado: 'inactivo' });
    return true;
  },

  unidadesValidas() {
    return UNIDADES_VALIDAS;
  },
};

export default productoService;
