import prisma from '../infra/prisma/prismaClient.js';
import inventarioRepository from '../repositories/inventarioRepository.js';
import configuracionContableService from './configuracionContableService.js';
import asientoContableService from "./contabilidad/asiento/asientoContableService.js";
import periodoContableService from './periodoContableService.js';


const SUBTIPOS_ENTRADA = ['REABASTECIMIENTO'];
const MOTIVOS_SALIDA = ['VENTA', 'DANIO', 'CONSUMO_INTERNO', 'AJUSTE', 'OTRO'];

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const buildFifoLayers = (movimientos, costoFallback) => {
  const capas = [];

  for (const movimiento of movimientos) {
    if (movimiento.tipo === 'entrada') {
      const costoUnitario = toNumber(movimiento.costoUnitario, costoFallback);
      capas.push({
        cantidadDisponible: Number(movimiento.cantidad),
        costoUnitario,
      });
      continue;
    }

    let pendiente = Number(movimiento.cantidad);

    while (pendiente > 0 && capas.length > 0) {
      const capa = capas[0];
      const consumido = Math.min(capa.cantidadDisponible, pendiente);
      capa.cantidadDisponible -= consumido;
      pendiente -= consumido;

      if (capa.cantidadDisponible <= 0) {
        capas.shift();
      }
    }
  }

  return capas;
};

const calcularCostoSalidaFIFO = ({ movimientos, cantidadSalida, costoFallback }) => {
  const capasDisponibles = buildFifoLayers(movimientos, costoFallback).map((capa) => ({ ...capa }));

  let pendiente = Number(cantidadSalida);
  let costoTotal = 0;

  while (pendiente > 0 && capasDisponibles.length > 0) {
    const capa = capasDisponibles[0];
    const consumido = Math.min(capa.cantidadDisponible, pendiente);

    costoTotal += consumido * capa.costoUnitario;
    capa.cantidadDisponible -= consumido;
    pendiente -= consumido;

    if (capa.cantidadDisponible <= 0) {
      capasDisponibles.shift();
    }
  }

  if (pendiente > 0) {
    const err = new Error('No hay capas suficientes para calcular costo FIFO de la salida solicitada.');
    err.status = 400;
    throw err;
  }

  const costoUnitario = round2(costoTotal / Number(cantidadSalida));
  return {
    costoUnitario,
    costoTotal: round2(costoTotal),
  };
};

const calcularCostoSalidaPromedio = ({ movimientos, cantidadSalida, costoFallback }) => {
  let cantidadDisponible = 0;
  let costoDisponible = 0;

  for (const movimiento of movimientos) {
    if (movimiento.tipo === 'entrada') {
      const costoUnitarioEntrada = toNumber(movimiento.costoUnitario, costoFallback);
      const costoTotalEntrada = round2(Number(movimiento.cantidad) * costoUnitarioEntrada);

      cantidadDisponible += Number(movimiento.cantidad);
      costoDisponible += costoTotalEntrada;
      continue;
    }

    const cantidadSalidaHistorica = Number(movimiento.cantidad);
    const costoSalidaHistorica =
      movimiento.costoTotal !== null && movimiento.costoTotal !== undefined
        ? toNumber(movimiento.costoTotal, 0)
        : round2(cantidadSalidaHistorica * toNumber(movimiento.costoUnitario, costoFallback));

    cantidadDisponible -= cantidadSalidaHistorica;
    costoDisponible -= costoSalidaHistorica;
  }

  if (cantidadDisponible <= 0) {
    const err = new Error('No hay inventario disponible para calcular costo promedio ponderado.');
    err.status = 400;
    throw err;
  }

  const costoUnitario = round2(costoDisponible / cantidadDisponible);
  const costoTotal = round2(costoUnitario * Number(cantidadSalida));

  return {
    costoUnitario,
    costoTotal,
  };
};

const inventarioService = {
  async registrarEntrada(body) {
    const {
      productoId,
      sucursalId,
      cantidad,
      fechaHora,
      proveedorId,
      proveedorNombre,
      observaciones,
      usuarioId,
    } = body;

    const tipoEntrada = body.tipoEntrada || "REABASTECIMIENTO";

    if (!productoId || !sucursalId || !cantidad || !fechaHora) {
      const err = new Error('Faltan campos obligatorios: productoId, sucursalId, cantidad, fechaHora, tipoEntrada');
      err.status = 400;
      throw err;
    }

    if (
      tipoEntrada !== "PRODUCTO_NUEVO" &&
      !SUBTIPOS_ENTRADA.includes(String(tipoEntrada))
    ) {
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

    await periodoContableService.assertPeriodoAbierto({
      sucursalId,
      fecha,
      actionLabel: 'registrar entradas de inventario',
    });

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
      const configMetodo = await configuracionContableService.getMetodoInventario();
      const costoUnitario = round2(toNumber(producto.costo, 0));
      const costoTotal = round2(costoUnitario * Number(cantidad));

      const inventario = await inventarioRepository.upsertInventarioEntrada(
        productoId,
        sucursalId,
        cantidad,
        tx
      );

      const alerta = await inventarioRepository.syncAlertaInventarioById(
        inventario.id,
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
          metodoValuacionAplicado: configMetodo.metodoValuacion,
          costoUnitario,
          costoTotal,
          fechaMovimiento: fecha,
          estado: 'completado',
          referenciaTipo: 'movimiento_manual',
          referenciaId: null,
          productoId: BigInt(productoId),
          sucursalId: BigInt(sucursalId),
          usuarioId: usuarioId,
          proveedorId: proveedorIdFinal,
        },
        tx
      );

      const asiento = await asientoContableService.generarAsiento({
        tipoOperacion: "INVENTARIO_ENTRADA",
        idOperacionOrigen: movimiento.id,
        descripcion: "Entrada de inventario por compra",
        subtotal: costoTotal,
        impuesto: 0,
        total: costoTotal,
        sucursalId,
        fecha,
        tx
      });

      await tx.movimientoInventario.update({
        where: { id: movimiento.id },
        data: {
          asientoContableId: asiento.id
        }
      });

      return {
        movimiento,
        inventario,
        alerta,
      };
    });
  },

  async registrarSalida(body, tx = prisma) {

    const {
      productoId,
      sucursalId,
      cantidad,
      fechaHora,
      motivoSalida,
      detalleMotivo,
      observaciones,
      usuarioId,
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

    await periodoContableService.assertPeriodoAbierto({
      sucursalId,
      fecha,
      tx,
      actionLabel: 'registrar salidas de inventario',
    });

    const inventarioActual = await inventarioRepository.findInventario(productoId, sucursalId, tx);
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

    {
      const configMetodo = await configuracionContableService.getMetodoInventario();
      const movimientosPrevios = await inventarioRepository.getMovimientosValuacion(
        productoId,
        sucursalId,
        fecha,
        tx
      );

      const costoFallback = round2(toNumber(producto.costo, 0));

      let valuacionSalida;

      if (motivoSalida === "VENTA") {

        const costoUnitario = round2(toNumber(producto.costo, 0));

        valuacionSalida = {
          costoUnitario,
          costoTotal: round2(costoUnitario * Number(cantidad))
        };

      }
      else if (!movimientosPrevios || movimientosPrevios.length === 0) {

        const costoUnitario = round2(toNumber(producto.costo, 0));

        valuacionSalida = {
          costoUnitario,
          costoTotal: round2(costoUnitario * Number(cantidad))
        };

      }
      else {

        valuacionSalida = configMetodo.metodoValuacion === 'PROMEDIO_PONDERADO'
          ? calcularCostoSalidaPromedio({
            movimientos: movimientosPrevios,
            cantidadSalida: Number(cantidad),
            costoFallback,
          })
          : calcularCostoSalidaFIFO({
            movimientos: movimientosPrevios,
            cantidadSalida: Number(cantidad),
            costoFallback,
          });

      }

      if (!valuacionSalida || valuacionSalida.costoTotal <= 0) {

        const costoUnitarioFallback = round2(toNumber(producto.costo, 0));

        valuacionSalida = {
          costoUnitario: costoUnitarioFallback,
          costoTotal: round2(costoUnitarioFallback * Number(cantidad))
        };

      }

      const inventario = await inventarioRepository.updateInventarioSalida(
        inventarioActual.id,
        cantidad,
        tx
      );

      const alerta = await inventarioRepository.syncAlertaInventarioById(
        inventario.id,
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
          metodoValuacionAplicado: configMetodo.metodoValuacion,
          costoUnitario: valuacionSalida.costoUnitario,
          costoTotal: valuacionSalida.costoTotal,
          fechaMovimiento: fecha,
          estado: 'completado',
          referenciaTipo: 'movimiento_manual',
          referenciaId: null,
          productoId: BigInt(productoId),
          sucursalId: BigInt(sucursalId),
          usuarioId: usuarioId,
          proveedorId: null,
        },
        tx
      );

      let tipoOperacion = "INVENTARIO_OTRO";

      if (motivoSalida === "VENTA") {
        tipoOperacion = "VENTA_COSTO";
      }

      if (motivoSalida === "DANIO") {
        tipoOperacion = "INVENTARIO_DANIO";
      }

      if (motivoSalida === "CONSUMO_INTERNO") {
        tipoOperacion = "INVENTARIO_CONSUMO_INTERNO";
      }

      if (motivoSalida === "AJUSTE") {
        tipoOperacion = "INVENTARIO_AJUSTE";
      }

      const asiento = await asientoContableService.generarAsiento({
        tipoOperacion,
        idOperacionOrigen: movimiento.id,
        descripcion: "Salida de inventario",
        subtotal: valuacionSalida.costoTotal,
        impuesto: 0,
        total: valuacionSalida.costoTotal,
        sucursalId,
        fecha,
        tx
      });

      await tx.movimientoInventario.update({
        where: { id: movimiento.id },
        data: {
          asientoContableId: asiento.id
        }
      });

      return {
        movimiento,
        inventario,
        alerta,
      };
    }
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

  async productosBajoStock(query = {}) {
    const { sucursalId } = query;
    return inventarioRepository.listProductosBajoStock(sucursalId);
  },

  async alertasInventario(query = {}) {
    const { sucursalId } = query;
    return inventarioRepository.listAlertasActivas(sucursalId);
  },

  tiposEntrada() {
    return SUBTIPOS_ENTRADA;
  },

  motivosSalida() {
    return MOTIVOS_SALIDA;
  },
};

export default inventarioService;
