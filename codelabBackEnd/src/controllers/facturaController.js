import facturaService from "../services/facturaService.js";

// Mapeo de informacion de factura, para evitar que envie datos delicados.
function mapFacturaResponse(f) {
  return {
    facturaId: f.id,
    numeroFactura: f.numeroFormateado,
    fechaEmision: f.fechaEmision,

    cliente: f.cliente ? {
      nombre: f.cliente.nombreCompleto,
      identificacion: f.cliente.identificacion
    } : null,

    usuario: {
      nombre: f.usuario.nombreCompleto
    },

    sucursal: {
      nombre: f.sucursal.nombre,
      direccion: f.sucursal.direccion
    },

    detalles: f.detalles?.map(d => ({
      producto: d.producto?.nombre || "N/A",
      cantidad: d.cantidad,
      precioUnitario: Number(d.precioUnitario),
      subtotal: Number(d.subtotal),
    })) || [],

    totales: {
      exento: Number(f.importeExento),
      gravado15: Number(f.importeGravado15),
      gravado18: Number(f.importeGravado18),
      isv15: Number(f.isv15),
      isv18: Number(f.isv18),
      total: Number(f.total)
    },

    cai: f.numeroFactura?.cai ? {
      codigo: f.numeroFactura.cai.codigo,
      fechaLimite: f.numeroFactura.cai.fechaFin,
    } : null,

    rangoEmision: f.numeroFactura?.cai?.rangoEmision ? {
      inicio: Number(f.numeroFactura.cai.rangoEmision.inicioRango),
      fin: Number(f.numeroFactura.cai.rangoEmision.finRango)
    } : null

  };
}

const facturaController = {

  // crear facturas
async createFactura(req, res, next) {
  try {

    const { clienteId, usuarioId, sucursalId, items, ventaId } = req.body;

    const facturaCreada = await facturaService.emitFactura({
      clienteId,
      usuarioId,
      sucursalId,
      items,
      ventaId
    });

    const factura = await facturaService.getFacturaByNumero(
      facturaCreada.numeroFormateado
    );

    res.json({
      success: true,
      data: mapFacturaResponse(factura)
    });

  } catch (error) {
    next(error);
  }
},
  // GET facturas
  async getFacturas(req, res, next) {
    try {

      const { usuarioId, clienteId, sucursalId } = req.query;

      const facturas = await facturaService.getFacturas({
        usuarioId,
        clienteId,
        sucursalId
      });

      // aplicando mapeo
      const data = facturas.map(mapFacturaResponse);

      res.json({
        success: true,
        data
      });

    } catch (error) {
      next(error);
    }
  },

  // GET /facturas/:numeroFactura para obtener factura por numero
  async getFacturaByNumero(req, res, next) {
    try {

      const { numeroFactura } = req.params;

      const factura = await facturaService.getFacturaByNumero(numeroFactura);

      // aplicando mapeo
      res.json({
        success: true,
        data: mapFacturaResponse(factura)
      });

    } catch (error) {
      next(error);
    }
  }

};

export default facturaController;