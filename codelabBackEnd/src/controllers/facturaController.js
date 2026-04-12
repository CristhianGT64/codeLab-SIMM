import facturaService from "../services/facturaService.js";

const getFacturaStatus = (factura) => {
  const estadoVenta = String(factura?.venta?.estado ?? "").toLowerCase();

  if (estadoVenta === "anulada") {
    return "anulada";
  }

  if (estadoVenta === "pendiente") {
    return "pendiente";
  }

  return "pagada";
};

const mapFacturaResponse = (factura) => {
  const estadoFactura = getFacturaStatus(factura);
  const totalFactura = Number(factura.total ?? 0);

  return {
    facturaId: String(factura.id),
    numeroFactura: factura.numeroFormateado,
    fechaEmision: factura.fechaEmision,
    clienteId: factura.clienteId ? String(factura.clienteId) : null,
    usuarioId: factura.usuarioId ? String(factura.usuarioId) : null,
    sucursalId: factura.sucursalId ? String(factura.sucursalId) : null,
    ventaId: factura.ventaId ? String(factura.ventaId) : null,
    estadoFactura,
    saldoPendiente: estadoFactura === "pendiente" ? totalFactura : 0,
    detallesCount: factura.detalles?.length ?? 0,
    cliente: factura.cliente
      ? {
          nombre: factura.cliente.nombreCompleto,
          identificacion: factura.cliente.identificacion,
        }
      : null,
    usuario: factura.usuario
      ? {
          nombre: factura.usuario.nombreCompleto,
          usuario: factura.usuario.usuario,
        }
      : null,
    sucursal: factura.sucursal
      ? {
          nombre: factura.sucursal.nombre,
          direccion: factura.sucursal.direccion,
        }
      : null,
    detalles: factura.detalles?.map((detalle) => ({
      id: String(detalle.id),
      productoId: String(detalle.productoId),
      producto: detalle.producto?.nombre || "N/A",
      cantidad: detalle.cantidad,
      precioUnitario: Number(detalle.precioUnitario),
      subtotal: Number(detalle.subtotal),
      tasaImpuesto: Number(detalle.tasaImpuesto),
      montoImpuesto: Number(detalle.montoImpuesto),
      tipoImpuesto: detalle.tipoImpuesto,
    })) || [],
    totales: {
      exento: Number(factura.importeExento),
      gravado15: Number(factura.importeGravado15),
      gravado18: Number(factura.importeGravado18),
      isv15: Number(factura.isv15),
      isv18: Number(factura.isv18),
      total: totalFactura,
    },
    cai: factura.numeroFactura?.cai
      ? {
          codigo: factura.numeroFactura.cai.codigo,
          fechaLimite: factura.numeroFactura.cai.fechaFin,
        }
      : null,
    rangoEmision: factura.numeroFactura?.cai?.rangoEmision
      ? {
          inicio: Number(factura.numeroFactura.cai.rangoEmision.inicioRango),
          fin: Number(factura.numeroFactura.cai.rangoEmision.finRango),
        }
      : null,
  };
};

const getFiltersFromQuery = (query = {}) => ({
  usuarioId: query.usuarioId,
  clienteId: query.clienteId,
  sucursalId: query.sucursalId,
  fechaInicio: query.fechaInicio,
  fechaFin: query.fechaFin,
});

const facturaController = {
  async createFactura(req, res, next) {
    try {
      const { clienteId, usuarioId, sucursalId, items, ventaId } = req.body;

      const facturaCreada = await facturaService.emitFactura({
        clienteId,
        usuarioId,
        sucursalId,
        items,
        ventaId,
      });

      const factura = await facturaService.getFacturaByNumero(
        facturaCreada.numeroFormateado,
      );

      res.json({
        success: true,
        data: mapFacturaResponse(factura),
      });
    } catch (error) {
      next(error);
    }
  },

  async getFacturas(req, res, next) {
    try {
      const filtros = getFiltersFromQuery(req.query);
      const facturas = await facturaService.getFacturas(filtros);

      res.json({
        success: true,
        data: facturas.map(mapFacturaResponse),
      });
    } catch (error) {
      next(error);
    }
  },

  async exportFacturas(req, res, next) {
    try {
      const filtros = getFiltersFromQuery(req.query);
      const facturas = await facturaService.getFacturas(filtros);
      const data = facturas.map(mapFacturaResponse);
      const pdfBuffer = facturaService.buildHistorialPdf(data, filtros);
      const today = new Date().toISOString().slice(0, 10);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="historial-facturacion-${today}.pdf"`,
      );
      res.setHeader("Content-Length", pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  },

  async getFacturaByNumero(req, res, next) {
    try {
      const { numeroFactura } = req.params;
      const factura = await facturaService.getFacturaByNumero(numeroFactura);

      res.json({
        success: true,
        data: mapFacturaResponse(factura),
      });
    } catch (error) {
      next(error);
    }
  },
};

export default facturaController;
