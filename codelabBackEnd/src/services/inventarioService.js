import prisma from '../infra/prisma/prismaClient.js';
import inventarioRepository from '../repositories/inventarioRepository.js';

const SUBTIPOS_ENTRADA = ['PRODUCTO_NUEVO', 'REABASTECIMIENTO'];
const MOTIVOS_SALIDA = ['VENTA', 'DANIO', 'CONSUMO_INTERNO', 'AJUSTE', 'OTRO'];

const inventarioService = {
  async registrarEntrada(body) {
    const {
      productoId,
      sucursalId,
      cantidad,
      fechaHora,
      proveedorId,
      proveedorNombre,
      tipoEntrada,
      observaciones,
    } = body;

    if (!productoId || !sucursalId || !cantidad || !fechaHora || !tipoEntrada) {
      const err = new Error('Faltan campos obligatorios: productoId, sucursalId, cantidad, fechaHora, tipoEntrada');
      err.status = 400;
      throw err;
    }

    if (!SUBTIPOS_ENTRADA.includes(String(tipoEntrada))) {
      const err = new Error('tipoEntrada inválido. Valores permitidos: PRODUCTO_NUEVO, REABASTECIMIENTO');
      err.status = 400;
      throw err;
    }

    if (!Number.isInteger(Number(cantidad)) || Number(cantidad) <= 0) {
      const err = new Error('La cantidad debe ser un número entero mayor que 0.');
      err.status = 400;
      throw err;
    }

    const fecha = new Date(fechaHora);
    if (Number.isNaN(fecha.getTime())) {
      const err = new Error('fechaHora no tiene un formato válido.');
      err.status = 400;
      throw err;
    }

    const producto = await inventarioRepository.findProductoById(productoId);
    if (!producto) {
      const err = new Error('Producto no encontrado.');
      err.status = 404;
      throw err;
    }

    if (producto.estado !== 'activo') {
      const err = new Error('El producto está inactivo.');
      err.status = 400;
      throw err;
    }

    const sucursal = await inventarioRepository.findSucursalById(sucursalId);
    if (!sucursal) {
      const err = new Error('Sucursal no encontrada.');
      err.status = 404;
      throw err;
    }

    if (!sucursal.activa) {
      const err = new Error('La sucursal está inactiva.');
      err.status = 400;
      throw err;
    }

    let proveedorIdFinal = null;

    if (proveedorId !== undefined && proveedorId !== null && proveedorId !== '') {
      const proveedor = await inventarioRepository.findProveedorById(proveedorId);
      if (!proveedor) {
        const err = new Error('Proveedor no encontrado.');
        err.status = 404;
        throw err;
      }

      if (!proveedor.disponible) {
        const err = new Error('El proveedor está inactivo.');
        err.status = 400;
        throw err;
      }

      proveedorIdFinal = BigInt(proveedorId);
    } else if (proveedorNombre && String(proveedorNombre).trim()) {
      const err = new Error('Debes enviar proveedorId de un proveedor existente.');
      err.status = 400;
      throw err;
    } else {
      const err = new Error('El proveedor es obligatorio.');
      err.status = 400;
      throw err;
    }

    return prisma.$transaction(async (tx) => {
      const inventario = await inventarioRepository.upsertInventarioEntrada(
        productoId,
        sucursalId,
        cantidad,
        tx
      );

      const movimiento = await inventarioRepository.createMovimiento(
        {
          tipo: 'entrada',
          subtipoEntrada: tipoEntrada,
          motivoSalida: null,
          detalleMotivo: tipoEntrada === 'PRODUCTO_NUEVO' ? 'Primera entrada del producto' : 'Reabastecimiento de inventario',
          observaciones: observaciones ? String(observaciones).trim() : null,
          cantidad: Number(cantidad),
          stockResultante: inventario.stockActual,
          fechaMovimiento: fecha,
          estado: 'completado',
          referenciaTipo: 'movimiento_manual',
          referenciaId: null,
          productoId: BigInt(productoId),
          sucursalId: BigInt(sucursalId),
          usuarioId: null,
          proveedorId: proveedorIdFinal,
        },
        tx
      );

      return {
        movimiento,
        inventario,
      };
    });
  },

  async registrarSalida(body) {
    const {
      productoId,
      sucursalId,
      cantidad,
      fechaHora,
      motivoSalida,
      detalleMotivo,
      observaciones,
    } = body;

    if (!productoId || !sucursalId || !cantidad || !fechaHora || !motivoSalida || !detalleMotivo) {
      const err = new Error('Faltan campos obligatorios: productoId, sucursalId, cantidad, fechaHora, motivoSalida, detalleMotivo');
      err.status = 400;
      throw err;
    }

    if (!MOTIVOS_SALIDA.includes(String(motivoSalida))) {
      const err = new Error('motivoSalida inválido. Valores permitidos: VENTA, DANIO, CONSUMO_INTERNO, AJUSTE, OTRO');
      err.status = 400;
      throw err;
    }

    if (!Number.isInteger(Number(cantidad)) || Number(cantidad) <= 0) {
      const err = new Error('La cantidad debe ser un número entero mayor que 0.');
      err.status = 400;
      throw err;
    }

    const fecha = new Date(fechaHora);
    if (Number.isNaN(fecha.getTime())) {
      const err = new Error('fechaHora no tiene un formato válido.');
      err.status = 400;
      throw err;
    }

    const producto = await inventarioRepository.findProductoById(productoId);
    if (!producto) {
      const err = new Error('Producto no encontrado.');
      err.status = 404;
      throw err;
    }

    if (producto.estado !== 'activo') {
      const err = new Error('El producto está inactivo.');
      err.status = 400;
      throw err;
    }

    const sucursal = await inventarioRepository.findSucursalById(sucursalId);
    if (!sucursal) {
      const err = new Error('Sucursal no encontrada.');
      err.status = 404;
      throw err;
    }

    if (!sucursal.activa) {
      const err = new Error('La sucursal está inactiva.');
      err.status = 400;
      throw err;
    }

    const inventarioActual = await inventarioRepository.findInventario(productoId, sucursalId);
    if (!inventarioActual) {
      const err = new Error('No existe inventario para ese producto en la sucursal indicada.');
      err.status = 400;
      throw err;
    }

    if (Number(cantidad) > inventarioActual.stockActual) {
      const err = new Error(`Stock insuficiente. Disponible: ${inventarioActual.stockActual}, solicitado: ${cantidad}`);
      err.status = 400;
      throw err;
    }

    return prisma.$transaction(async (tx) => {
      const inventario = await inventarioRepository.updateInventarioSalida(
        inventarioActual.id,
        cantidad,
        tx
      );

      const movimiento = await inventarioRepository.createMovimiento(
        {
          tipo: 'salida',
          subtipoEntrada: null,
          motivoSalida,
          detalleMotivo: String(detalleMotivo).trim(),
          observaciones: observaciones ? String(observaciones).trim() : null,
          cantidad: Number(cantidad),
          stockResultante: inventario.stockActual,
          fechaMovimiento: fecha,
          estado: 'completado',
          referenciaTipo: 'movimiento_manual',
          referenciaId: null,
          productoId: BigInt(productoId),
          sucursalId: BigInt(sucursalId),
          usuarioId: null,
          proveedorId: null,
        },
        tx
      );

      return {
        movimiento,
        inventario,
      };
    });
  },

  async historial(query = {}) {
    const { tipo, productoId, sucursalId, fecha, fechaDesde, fechaHasta } = query;

    if (tipo && !['entrada', 'salida'].includes(tipo)) {
      const err = new Error('El filtro tipo debe ser "entrada" o "salida".');
      err.status = 400;
      throw err;
    }

    return inventarioRepository.getHistorial({
      tipo,
      productoId,
      sucursalId,
      fecha,
      fechaDesde,
      fechaHasta,
    });
  },

  async historialPorProducto(productoId, sucursalId) {
    if (!productoId) {
      const err = new Error('productoId es obligatorio.');
      err.status = 400;
      throw err;
    }

    if (!sucursalId) {
      const err = new Error('sucursalId es obligatorio como query param.');
      err.status = 400;
      throw err;
    }

    const producto = await inventarioRepository.findProductoById(productoId);
    if (!producto) {
      const err = new Error('Producto no encontrado.');
      err.status = 404;
      throw err;
    }

    const sucursal = await inventarioRepository.findSucursalById(sucursalId);
    if (!sucursal) {
      const err = new Error('Sucursal no encontrada.');
      err.status = 404;
      throw err;
    }

    const inventario = await inventarioRepository.findInventario(productoId, sucursalId);
    const movimientos = await inventarioRepository.getHistorialByProducto(productoId, sucursalId);

    return {
      producto,
      sucursal,
      stockActual: inventario ? inventario.stockActual : 0,
      movimientos,
    };
  },

  async dashboard(query = {}) {
    const { sucursalId } = query;
    return inventarioRepository.getDashboardResumen(sucursalId);
  },

  tiposEntrada() {
    return SUBTIPOS_ENTRADA;
  },

  motivosSalida() {
    return MOTIVOS_SALIDA;
  },
};

export default inventarioService;