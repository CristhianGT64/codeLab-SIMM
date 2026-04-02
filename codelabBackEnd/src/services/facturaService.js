import prisma from "../infra/prisma/prismaClient.js";

import facturaRepository from "../repositories/facturaRepository.js";
import productoRepository from "../repositories/productoRepository.js";
import inventarioRepository from "../repositories/inventarioRepository.js";
import clienteRepository from "../repositories/Clientes/clientRepository.js";
import ventaRepository from "../repositories/ventas/ventaRepository.js";

const facturaService = {

  async emitFactura({ clienteId, usuarioId, sucursalId, items, ventaId }) {

    return await prisma.$transaction(async (tx) => {

      
      // Validaciones básicas
      
      if (!usuarioId) throw new Error("usuarioId es requerido");
      if (!sucursalId) throw new Error("sucursalId es requerido");

      if ((!items || items.length === 0) && !ventaId) {
        throw new Error("Debe enviar items o ventaId");
      }

      if (clienteId) {
        const cliente = await clientRepository.findById(clienteId);
        if (!cliente) throw new Error("Cliente no existe");
      }

      let productosProcesados = [];

      if (ventaId && !clienteId ) {
        const venta = await ventaRepository.getVentaById(ventaId);
        clienteId= venta?.clienteId  || null; // asignando clienteId de la venta o null si no tiene
        if (!venta) throw new Error("Venta no existe");
        if (venta.estado !== "pendiente") {
          throw new Error("La venta ya fue procesada");
        }

        productosProcesados = venta.detalles.map(d => ({
          productoId: d.productoId,
          cantidad: d.cantidad
        }));

      } else {
        productosProcesados = items;
      }

      if (productosProcesados.length === 0) {
        throw new Error("La factura debe contener productos");
      }

      // Variables fiscales
  
      let importeExento = 0;
      let importeGravado15 = 0;
      let importeGravado18 = 0;

      let isv15 = 0;
      let isv18 = 0;

      const detalles = [];

      // productos
      for (const item of productosProcesados) {

        if (item.cantidad <= 0) throw new Error("Cantidad inválida");

        const producto = await productoRepository.findById(item.productoId);

        if (!producto) throw new Error(`Producto ${item.productoId} no existe`);
        if (!producto.impuesto) throw new Error(`Producto ${producto.nombre} sin impuesto`);

        const tasa = Number(producto.impuesto.tasa);

        const inventario = await inventarioRepository.findStock(item.productoId, sucursalId, tx);

        if (!inventario) throw new Error(`Sin inventario para ${producto.nombre}`);
        if (inventario.stockActual < item.cantidad) {
          throw new Error(`Stock insuficiente para ${producto.nombre}`);
        }

        const precioUnitario = Number(producto.precioVenta);
        const subtotalItem = precioUnitario * item.cantidad;
        const impuestoItem = Number((subtotalItem * tasa).toFixed(2));

        if (tasa === 0) {
          importeExento += subtotalItem;
        } else if (tasa === 0.15) {
          importeGravado15 += subtotalItem;
          isv15 += impuestoItem;
        } else if (tasa === 0.18) {
          importeGravado18 += subtotalItem;
          isv18 += impuestoItem;
        } else {
          throw new Error("Tasa no soportada");
        }

        detalles.push({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario,
          subtotal: subtotalItem,
          tasaImpuesto: tasa,
          montoImpuesto: impuestoItem,
          tipoImpuesto: producto.impuesto.nombre
        });
      }

      // Totales
      const subtotal = importeExento + importeGravado15 + importeGravado18;
      const impuestoTotal = isv15 + isv18;
      const total = subtotal + impuestoTotal;

      // cai y numero de factura
      const cais = await tx.cai.findMany({
        where: {
          activo: true,
          fechaInicio: { lte: new Date() },
          fechaFin: { gte: new Date() }
        },
        include: { rangoEmision: true },
        orderBy: { fechaInicio: "asc" } 
      });

      if (!cais.length) {
        throw new Error("No hay CAI vigente");
      }

      let numeroFactura = null;
      let caiSeleccionado = null;

      //  Rotacion automática de CAI
      for (const cai of cais) {

        if (!cai.rangoEmision) continue;

        const rango = cai.rangoEmision;

        const last = await facturaRepository.getLastCorrelativo({
          tipoDocumentoId: 1,
          establecimientoId: 1,
          puntoEmisionId: 1,
          caiId: cai.id
        });

        const correlativo = last === 0
          ? Number(rango.inicioRango)
          : last + 1;

        if (correlativo > Number(rango.finRango)) {
          continue; // CAI agotado >>siguiente
        }

        const numeroFormateado =
          `${String(1).padStart(3, "0")}-` +
          `${String(1).padStart(3, "0")}-` +
          `${String(1).padStart(2, "0")}-` +
          `${String(correlativo).padStart(8, "0")}`;

        try {
          numeroFactura = await facturaRepository.createNumeroFactura({
            tipoDocumentoId: 1,
            establecimientoId: 1,
            puntoEmisionId: 1,
            caiId: cai.id,
            correlativo,
            numeroFormateado
          }, tx);

          caiSeleccionado = cai;
          break;

        } catch (error) {
          continue; // intenta siguiente CAI
        }
      }

      if (!numeroFactura) {
        throw new Error("Todos los CAI están agotados");
      }

      // Factura
      const factura = await facturaRepository.createFactura({
        subtotal,
        impuesto: impuestoTotal,
        total,

        importeExento,
        importeGravado15,
        importeGravado18,
        isv15,
        isv18,

        fechaEmision: new Date(),

        cliente: clienteId
          ? { connect: { id: BigInt(clienteId) } }
          : undefined,

        usuario: { connect: { id: BigInt(usuarioId) } },
        sucursal: { connect: { id: BigInt(sucursalId) } },

        venta: ventaId
          ? { connect: { id: BigInt(ventaId) } }
          : undefined,

        numeroFactura: {
          connect: { id: BigInt(numeroFactura.id) }
        }

      }, tx);

      // Detalle de lo de la venta
      await facturaRepository.createDetalleFacturaMany(
        detalles.map(d => ({
          ...d,
          facturaId: factura.id
        })),
        tx
      );

      // inventario y kardex
      for (const d of detalles) {

        const inventario = await inventarioRepository.findStock(
          d.productoId,
          sucursalId,
          tx
        );

        const stockResultante = inventario.stockActual - d.cantidad;

        await tx.movimientoInventario.create({
          data: {
            productoId: BigInt(d.productoId),
            sucursalId: BigInt(sucursalId),
            cantidad: d.cantidad,
            tipo: "salida",
            motivoSalida: "VENTA",
            referenciaTipo: "FACTURA",
            referenciaId: factura.id,
            fechaMovimiento: new Date(),
            stockResultante
          }
        });

        const inventarioActualizado = await inventarioRepository.decreaseStock(
          d.productoId,
          sucursalId,
          d.cantidad,
          tx
        );

        await inventarioRepository.syncAlertaInventarioById(inventarioActualizado.id, tx);
      }

      // Actualizar estado de venta
      if (ventaId) {
        await tx.venta.update({
          where: { id: ventaId },
          data: { estado: "completada" }
        });
      }

      return factura;

    });

  },

  async getFacturas(filtros) {
    return await facturaRepository.findFacturas(filtros);
  },

  async getFacturaByNumero(numeroFactura) {
    const factura = await facturaRepository.findFacturaByNumero(numeroFactura);
    if (!factura) throw new Error("Factura no encontrada");
    return factura;
  }

};

export default facturaService;
