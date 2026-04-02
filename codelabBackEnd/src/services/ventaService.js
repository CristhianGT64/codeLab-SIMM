import prisma from "../infra/prisma/prismaClient.js";
import ventaRepository from "../repositories/ventaRepository.js";
import detalleVentaRepository from "../repositories/detalleVentaRepository.js";
import productoRepository from "../repositories/productoRepository.js";
import inventarioRepository from "../repositories/inventarioRepository.js";
import clienteRepository from "../repositories/Clientes/clientRepository.js";

const ventaService = {

  async createVenta({ clienteId, usuarioId, sucursalId, productos }) {

    if (!usuarioId) {
      throw new Error("usuarioId es requerido");
    }

    if (!sucursalId) {
      throw new Error("sucursalId es requerido");
    }

    if (!productos || productos.length === 0) {
      throw new Error("La venta debe contener productos");
    }

    if (clienteId) {
      const cliente = await clienteRepository.findById(clienteId);
      if (!cliente) {
        throw new Error("Cliente no existe");
      }
    }

    let total = 0;
    let totalImpuesto = 0;
    const detalles = [];

    for (const item of productos) {

      if (item.cantidad <= 0) {
        throw new Error("Cantidad inválida");
      }

      const producto = await productoRepository.findById(item.productoId);

      if (!producto) {
        throw new Error(`Producto ${item.productoId} no existe`);
      }

      
      if (!producto.impuesto) {
        throw new Error(`Producto ${producto.nombre} no tiene impuesto asignado`);
      }

      const tasa = Number(producto.impuesto.tasa);

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

    return await prisma.$transaction(async (tx) => {

      const venta = await ventaRepository.createVenta({
        usuarioId,
        sucursalId,
        total, 
        estado: "pendiente",
        ...(clienteId && { clienteId })
      }, tx);

      const detallesVenta = detalles.map(detalle => ({
        ...detalle,
        ventaId: venta.id
      }));

      await detalleVentaRepository.createManyDetalleVenta(detallesVenta, tx);

      return venta;

    });

  },

  async getVentas(filtros) {
    return await ventaRepository.getVentas(filtros);
  },

  async getVentaById(id) {
    return await ventaRepository.getVentaById(id);
  }

};

export default ventaService;