import prisma from "../infra/prisma/prismaClient.js";
import ventaRepository from "../repositories/ventaRepository.js";
import detalleVentaRepository from "../repositories/detalleVentaRepository.js";
import productoRepository from "../repositories/productoRepository.js";
import inventarioRepository from "../repositories/inventarioRepository.js";

const ventaService = {

  async createVenta({ clienteId, usuarioId, sucursalId, productos }) {

    if (!productos || productos.length === 0) {
      throw new Error("La venta debe contener productos");
    }

    let total = 0;
    const detalles = [];

    for (const item of productos) {

      if (item.cantidad <= 0) {
        throw new Error("Cantidad inválida");
      }

      const producto = await productoRepository.findById(item.productoId);

      if (!producto) {
        throw new Error(`Producto ${item.productoId} no existe`);
      }

      const inventario = await inventarioRepository.findStock(
        item.productoId,
        sucursalId
      );

      if (!inventario) {
        throw new Error(`El producto ${producto.nombre} no tiene inventario en esta sucursal`);
      }

      if (inventario.stockActual < item.cantidad) {
        throw new Error(`Stock insuficiente para ${producto.nombre}`);
      }

      const precioUnitario = Number(producto.precioVenta);
      const subtotal = precioUnitario * item.cantidad;

      total += subtotal;

      detalles.push({
        productoId: item.productoId,
        cantidad: item.cantidad,
        precioUnitario,
        subtotal
      });

    }

    /**
     * Se utiliza una transacción para asegurar consistencia de datos.
     * Si ocurre un error en cualquier paso (venta, detalles o inventario),
     * la base de datos revierte todos los cambios automáticamente.
     * Esto evita inconsistencias como:
     * - venta creada pero inventario no actualizado
     * - detalles creados sin descontar stock
     */

    return await prisma.$transaction(async () => {

      const venta = await ventaRepository.createVenta({
        clienteId,
        usuarioId,
        sucursalId,
        total,
        estado: "completada"
      });

      const detallesVenta = detalles.map(detalle => ({
        ...detalle,
        ventaId: venta.id
      }));

      await detalleVentaRepository.createManyDetalleVenta(detallesVenta);

      for (const detalle of detalles) {

        await inventarioRepository.decreaseStock(
          detalle.productoId,
          sucursalId,
          detalle.cantidad
        );

      }

      return venta;

    });

  },

  async getVentas() {
    return await ventaRepository.getVentas();
  },

  async getVentaById(id) {
    return await ventaRepository.getVentaById(id);
  }

};

export default ventaService;