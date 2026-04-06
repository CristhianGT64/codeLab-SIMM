import prisma from "../../infra/prisma/prismaClient.js";
import ventaRepository from "../../repositories/ventaRepository.js";
import detalleVentaRepository from "../../repositories/detalleVentaRepository.js";
import productoRepository from "../../repositories/productoRepository.js";
import inventarioRepository from "../../repositories/inventarioRepository.js";
import inventarioService from "../inventarioService.js";
import clienteRepository from "../../repositories/Clientes/clientRepository.js";
import asientoContableService from "../contabilidad/asiento/asientoContableService.js";

const ventaService = {

  async createVenta({ clienteId, usuarioId, sucursalId, productos }) {

    if (!usuarioId) throw new Error("usuarioId es requerido");
    if (!sucursalId) throw new Error("sucursalId es requerido");
    if (!productos || productos.length === 0) {
      throw new Error("La venta debe contener productos");
    }

    if (clienteId) {
      const cliente = await clienteRepository.findById(clienteId);
      if (!cliente) throw new Error("Cliente no existe");
    }

    let total = 0;
    let totalImpuesto = 0;
    const detalles = [];

    for (const item of productos) {

      const producto = await productoRepository.findById(item.productoId);

      if (!producto) {
        throw new Error(`Producto ${item.productoId} no existe`);
      }

      const inventario = await inventarioRepository.findStock(
        item.productoId,
        sucursalId
      );

      if (!inventario) {
        throw new Error(`El producto ${producto.nombre} no tiene inventario`);
      }

      if (inventario.stockActual < item.cantidad) {
        throw new Error(`Stock insuficiente para ${producto.nombre}`);
      }

      const tasa = producto.impuesto ? Number(producto.impuesto.tasa) : 0;

      const precioUnitario = Number(producto.precioVenta);
      const subtotal = precioUnitario * item.cantidad;
      const impuesto = Number((subtotal * tasa).toFixed(2));

      total += subtotal + impuesto;
      totalImpuesto += impuesto;

      detalles.push({
        productoId: item.productoId,
        cantidad: item.cantidad,
        precioUnitario,
        subtotal
      });
    }

    /*
    ==========================
    TRANSACCIÓN VENTA
    ==========================
    */

    const venta = await prisma.$transaction(async (tx) => {

      const venta = await ventaRepository.createVenta({
        usuarioId,
        sucursalId,
        total,
        estado: "completada",
        ...(clienteId && { clienteId })
      }, tx);

      const detallesVenta = detalles.map(detalle => ({
        ...detalle,
        ventaId: venta.id
      }));

      await detalleVentaRepository.createManyDetalleVenta(detallesVenta, tx);

      return venta;

    });

    /*
    ==========================
    ASIENTO CONTABLE VENTA
    ==========================
    */

    const subtotal = total - totalImpuesto;

    const asiento = await asientoContableService.generarAsiento({
      tipoOperacion: "VENTA",
      idOperacionOrigen: venta.id,
      descripcion: "Registro contable de venta",
      subtotal,
      impuesto: totalImpuesto,
      total
    });

    await prisma.venta.update({
      where: { id: venta.id },
      data: { asientoContableId: asiento.id }
    });

    /*
    ==========================
    SALIDA INVENTARIO
    ==========================
    */

    for (const item of productos) {

      await inventarioService.registrarSalida({
        productoId: item.productoId,
        sucursalId,
        cantidad: item.cantidad,
        fechaHora: new Date(),
        motivoSalida: "VENTA",
        detalleMotivo: "Salida por venta",
        usuarioId
      });

    }

    return venta;
  },

  async getVentas(filtros) {
    return await ventaRepository.getVentas(filtros);
  },

  async getVentaById(id) {
    return await ventaRepository.getVentaById(id);
  }

};

export default ventaService;