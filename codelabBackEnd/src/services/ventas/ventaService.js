import prisma from "../../infra/prisma/prismaClient.js";
import ventaRepository from "../../repositories/ventas/ventaRepository.js";
import detalleVentaRepository from "../../repositories/detalleVentaRepository.js";
import productoRepository from "../../repositories/productoRepository.js";
import inventarioRepository from "../../repositories/inventarioRepository.js";
import clienteRepository from "../../repositories/Clientes/clientRepository.js";

const parseId = (value, fieldName, { required = false } = {}) => {
  if (value === undefined || value === null || value === "") {
    if (required) {
      const error = new Error(`${fieldName} es requerido`);
      error.status = 400;
      throw error;
    }

    return undefined;
  }

  if (!/^\d+$/.test(String(value))) {
    const error = new Error(`${fieldName} es invalido`);
    error.status = 400;
    throw error;
  }

  return BigInt(value);
};

const parseCantidad = (value) => {
  const cantidad = Number(value);

  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    const error = new Error("Cantidad invalida");
    error.status = 400;
    throw error;
  }

  return cantidad;
};

const formatVentaResponse = (venta) => {
  if (!venta) {
    return venta;
  }

  return {
    id: venta.id,
    total: venta.total,
    estado: venta.estado,
    createdAt: venta.createdAt,
    clienteId: venta.clienteId,
    usuarioId: venta.usuarioId,
    sucursalId: venta.sucursalId,
    nombreUsuario: venta.usuario?.nombreCompleto || venta.usuario?.usuario || null,
    nombreSucursal: venta.sucursal?.nombre || null,
    cliente: venta.cliente,
    detalles: venta.detalles
  };
};

const ventaService = {

  async createVenta({ clienteId, usuarioId, sucursalId, productos }) {
    const normalizedUsuarioId = parseId(usuarioId, "usuarioId", { required: true });
    const normalizedSucursalId = parseId(sucursalId, "sucursalId", { required: true });
    const normalizedClienteId = parseId(clienteId, "clienteId");

    if (!Array.isArray(productos) || productos.length === 0) {
      const error = new Error("La venta debe contener productos");
      error.status = 400;
      throw error;
    }

    if (normalizedClienteId) {
      const cliente = await clienteRepository.findById(normalizedClienteId);
      if (!cliente) {
        const error = new Error("Cliente no existe");
        error.status = 404;
        throw error;
      }
    }

    let total = 0;
    const detalles = [];

    for (const item of productos) {
      const productoId = parseId(item?.productoId, "productoId", { required: true });
      const cantidad = parseCantidad(item?.cantidad);

      const producto = await productoRepository.findById(productoId);

      if (!producto) {
        const error = new Error(`Producto ${item.productoId} no existe`);
        error.status = 404;
        throw error;
      }

      if (!producto.impuesto) {
        const error = new Error(`Producto ${producto.nombre} no tiene impuesto asignado`);
        error.status = 400;
        throw error;
      }

      const tasa = Number(producto.impuesto.tasa);
      const inventario = await inventarioRepository.findStock(productoId, normalizedSucursalId);

      if (!inventario) {
        const error = new Error(`El producto ${producto.nombre} no tiene inventario en esta sucursal`);
        error.status = 404;
        throw error;
      }

      if (inventario.stockActual < cantidad) {
        const error = new Error(`Stock insuficiente para ${producto.nombre}`);
        error.status = 400;
        throw error;
      }

      const precioUnitario = Number(producto.precioVenta);
      const subtotal = precioUnitario * cantidad;
      const impuesto = Number((subtotal * tasa).toFixed(2));

      total += subtotal + impuesto;

      detalles.push({
        productoId,
        cantidad,
        precioUnitario,
        subtotal
      });
    }

    return await prisma.$transaction(async (tx) => {
      const venta = await ventaRepository.createVenta({
        usuarioId: normalizedUsuarioId,
        sucursalId: normalizedSucursalId,
        total,
        estado: "pendiente",
        ...(normalizedClienteId && { clienteId: normalizedClienteId })
      }, tx);

      const detallesVenta = detalles.map((detalle) => ({
        ...detalle,
        ventaId: venta.id
      }));

      await detalleVentaRepository.createManyDetalleVenta(detallesVenta, tx);

      return venta;
    });
  },

  async getVentas(filtros) {
    const ventas = await ventaRepository.getVentas(filtros);
    return ventas.map(formatVentaResponse);
  },

  async getVentaById(id) {
    const normalizedId = parseId(id, "id", { required: true });
    const venta = await ventaRepository.getVentaById(normalizedId);

    if (!venta) {
      const error = new Error("Venta no encontrada");
      error.status = 404;
      throw error;
    }

    return formatVentaResponse(venta);
  }

};

export default ventaService;
