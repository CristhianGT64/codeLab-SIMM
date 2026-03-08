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
      imagenPath,
      sucursalId,
    } = body;

    if (
      !nombre ||
      !sku ||
      !categoriaId ||
      costo === undefined ||
      precioVenta === undefined ||
      !unidadMedida ||
      stockInicial === undefined
    ) {
      const err = new Error(
        'Faltan campos obligatorios: nombre, sku, categoriaId, costo, precioVenta, unidadMedida, stockInicial'
      );
      err.status = 400;
      throw err;
    }

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
        const err = new Error('No hay sucursales activas. Crea una sucursal antes de registrar productos.');
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
          imagenPath: imagenPath || null,
          estado: 'activo',
          categoriaId: BigInt(categoriaId),
        },
        select: {
          id: true,
          nombre: true,
          sku: true,
          costo: true,
          precioVenta: true,
          unidadMedida: true,
          imagenPath: true,
          estado: true,
          categoria: { select: { id: true, nombre: true } },
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
        select: { id: true, sucursalId: true, stockActual: true },
      });

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
    if (!prod) {
      const err = new Error('Producto no encontrado.');
      err.status = 404;
      throw err;
    }
    return prod;
  },

  async update(idParam, body = {}) {
    const id = BigInt(idParam);

    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
      const err = new Error('Body de solicitud inválido para actualizar producto.');
      err.status = 400;
      throw err;
    }

    const current = await productoRepository.findById(id);
    if (!current) {
      const err = new Error('Producto no encontrado.');
      err.status = 404;
      throw err;
    }

    if (body.sku !== undefined && body.sku !== current.sku) {
      const err = new Error('El SKU no se puede modificar.');
      err.status = 400;
      throw err;
    }

    if (body.categoriaId !== undefined) {
      const cat = await prisma.categoria.findUnique({
        where: { id: BigInt(body.categoriaId) },
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
    }

    if (body.unidadMedida !== undefined && !UNIDADES_VALIDAS.includes(body.unidadMedida)) {
      const err = new Error(`unidadMedida inválida. Valores permitidos: ${UNIDADES_VALIDAS.join(', ')}`);
      err.status = 400;
      throw err;
    }

    const costoNuevo = body.costo !== undefined ? body.costo : current.costo;
    const precioNuevo = body.precioVenta !== undefined ? body.precioVenta : current.precioVenta;
    if (Number(precioNuevo) <= Number(costoNuevo)) {
      const err = new Error('El precio de venta debe ser mayor al costo del producto.');
      err.status = 400;
      throw err;
    }

    const data = {};
    if (body.nombre !== undefined) data.nombre = body.nombre;
    if (body.costo !== undefined) data.costo = body.costo;
    if (body.precioVenta !== undefined) data.precioVenta = body.precioVenta;
    if (body.unidadMedida !== undefined) data.unidadMedida = body.unidadMedida;
    if (body.categoriaId !== undefined) data.categoriaId = BigInt(body.categoriaId);
    if (body.imagenPath !== undefined) data.imagenPath = body.imagenPath;

    return productoRepository.update(id, data);
  },

  async patchEstado(idParam, { estado }) {
    const id = BigInt(idParam);

    const current = await productoRepository.findById(id);
    if (!current) {
      const err = new Error('Producto no encontrado.');
      err.status = 404;
      throw err;
    }

    if (!estado || !['activo', 'inactivo'].includes(estado)) {
      const err = new Error('estado debe ser "activo" o "inactivo"');
      err.status = 400;
      throw err;
    }

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