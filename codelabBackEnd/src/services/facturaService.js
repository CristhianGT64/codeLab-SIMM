import prisma from "../infra/prisma/prismaClient.js";

import facturaRepository from "../repositories/facturaRepository.js";
import productoRepository from "../repositories/productoRepository.js";
import inventarioRepository from "../repositories/inventarioRepository.js";
import clienteRepository from "../repositories/clientRepository.js";
import ventaRepository from "../repositories/ventaRepository.js";

const ISV = 0.15;


const facturaService = {

  async emitFactura({ clienteId, usuarioId, sucursalId, items, ventaId }) {
  try {
    console.log("🚀 INICIO emisión de factura");

    return await prisma.$transaction(async (tx) => {

      console.log("1️⃣ Validaciones iniciales");

      if (!usuarioId) throw new Error("usuarioId es requerido");
      if (!sucursalId) throw new Error("sucursalId es requerido");

      if ((!items || items.length === 0) && !ventaId) {
        throw new Error("Debe enviar items o ventaId");
      }

      // CLIENTE
      if (clienteId) {
        console.log("2️⃣ Validando cliente:", clienteId);
        const cliente = await clienteRepository.findById(clienteId);
        if (!cliente) throw new Error("Cliente no existe");
      }

      let productosProcesados = [];

      // OBTENER PRODUCTOS
      if (ventaId) {
        console.log("3️⃣ Obteniendo productos desde venta:", ventaId);

        const venta = await ventaRepository.getVentaById(ventaId);

        if (!venta) throw new Error("Venta no existe");
        if (venta.estado !== "pendiente") {
          throw new Error("La venta ya fue procesada");
        }

        productosProcesados = venta.detalles.map(d => ({
          productoId: d.productoId,
          cantidad: d.cantidad
        }));

      } else {
        console.log("3️⃣ Usando items enviados directamente");
        productosProcesados = items;
      }

      if (productosProcesados.length === 0) {
        throw new Error("La factura debe contener productos");
      }

      console.log("📦 Productos a procesar:", productosProcesados.length);

      // VALIDAR PRODUCTOS
      let subtotal = 0;
      const detalles = [];

      for (const item of productosProcesados) {

        console.log(`🔎 Validando producto ${item.productoId}`);

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
          throw new Error(`Sin inventario para ${producto.nombre}`);
        }

        if (inventario.stockActual < item.cantidad) {
          throw new Error(`Stock insuficiente para ${producto.nombre}`);
        }

        const precioUnitario = Number(producto.precioVenta);
        const subtotalItem = precioUnitario * item.cantidad;

        subtotal += subtotalItem;

        detalles.push({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario,
          subtotal: subtotalItem
        });
      }

      console.log("💰 Subtotal calculado:", subtotal);

      const impuesto = subtotal * ISV;
      const total = subtotal + impuesto;

      console.log("🧾 Impuesto:", impuesto, "Total:", total);

      // CAI
      console.log("4️⃣ Buscando CAI vigente");

   const cai = await tx.cai.findFirst({
  where: {
    activo: true,
    fechaInicio: { lte: new Date() },
    fechaFin: { gte: new Date() }
  },
  include: {
    rangoEmision: true
  }
});

if (!cai) throw new Error("No hay CAI vigente");

if (!cai.rangoEmision) {
  throw new Error("CAI sin rango de emisión");
}

const rango = cai.rangoEmision;

console.log("📊 RANGO DESDE CAI:", {
  inicio: Number(rango.inicioRango),
  fin: Number(rango.finRango)
});


      // CORRELATIVO
      console.log("6️⃣ Generando correlativo");

      let numeroFactura;

      for (let intento = 0; intento < 3; intento++) {

        console.log(`🔁 Intento correlativo #${intento + 1}`);

        const last = await facturaRepository.getLastCorrelativo({
          tipoDocumentoId: 1,
          establecimientoId: 1,
          puntoEmisionId: 1,
          caiId: cai.id
        });
        
        const correlativo = last + 1;
        
        if (
            
        correlativo < Number(rango.inicioRango) ||
        correlativo > Number(rango.finRango)
        ) {
        throw new Error("CAI agotado");
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

          console.log("✅ Correlativo generado:", numeroFormateado);
          break;

        } catch (error) {
          console.warn("⚠️ Error correlativo, reintentando...");
          if (intento === 2) throw error;
        }
      }

      // FACTURA
      console.log("7️⃣ Creando factura");

      const factura = await facturaRepository.createFactura({
        subtotal,
        impuesto,
        total,
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

      console.log("✅ Factura creada ID:", factura.id);

      // DETALLES
      console.log("8️⃣ Creando detalles");

      await facturaRepository.createDetalleFacturaMany(
        detalles.map(d => ({ ...d, facturaId: factura.id })),
                tx
            );

            console.log("9️⃣ Actualizando inventario");

        for (const d of detalles) {

        // 1. Obtener inventario actual
        const inventario = await inventarioRepository.findStock(
            d.productoId,
            sucursalId
        );

        if (!inventario) {
            throw new Error("Inventario no encontrado");
        }

        // 2. Calcular stock resultante
        const stockResultante = inventario.stockActual - d.cantidad;

        if (stockResultante < 0) {
            throw new Error("Stock insuficiente en movimiento");
        }

        // 3. Registrar movimiento (kardex)
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

        // 4. Actualizar inventario
        await inventarioRepository.decreaseStock(
            d.productoId,
            sucursalId,
            d.cantidad,
            tx
        );
        }
      // ACTUALIZAR VENTA
      if (ventaId) {
        console.log("🔄 Actualizando estado de venta");

        await tx.venta.update({
          where: { id: ventaId },
          data: { estado: "completada" }
        });
      }

      console.log("🎉 FACTURA COMPLETADA");

      return factura;
    });

  } catch (error) {
    console.error("❌ ERROR REAL EN TRANSACCIÓN:", error.message);
    throw error;
  }
},

  async getFacturas(filtros) {
    return await facturaRepository.findFacturas(filtros);
  },

  async getFacturaByNumero(numeroFactura) {
    const factura = await facturaRepository.findFacturaByNumero(numeroFactura);

    if (!factura) {
      throw new Error("Factura no encontrada");
    }

    return factura;
  }

};

export default facturaService;