import facturaService from "../services/facturaService.js";

const facturaController = {

  // POST /facturas
  async createFactura(req, res, next) {
    try {

      const { clienteId, usuarioId, sucursalId, items, ventaId } = req.body;

      const factura = await facturaService.emitFactura({
        clienteId,
        usuarioId,
        sucursalId,
        items,
        ventaId
      });

      res.json({
        success: true,
        data: factura
      });

    } catch (error) {
      next(error);
    }
  },

  // GET /facturas
  async getFacturas(req, res, next) {
    try {

      const { usuarioId, clienteId, sucursalId } = req.query;

      const facturas = await facturaService.getFacturas({
        usuarioId,
        clienteId,
        sucursalId
      });

      res.json({
        success: true,
        data: facturas
      });

    } catch (error) {
      next(error);
    }
  },

  // GET /facturas/:numeroFactura
  async getFacturaByNumero(req, res, next) {
    try {

      const { numeroFactura } = req.params;

      const factura = await facturaService.getFacturaByNumero(numeroFactura);

      res.json({
        success: true,
        data: factura
      });

    } catch (error) {
      next(error);
    }
  }

};

export default facturaController;