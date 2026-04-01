import ventaService from "../../services/ventas/ventaService.js";

const ventaController = {

  async createVenta(req, res, next) {
    try {
      const { clienteId, usuarioId, sucursalId, productos } = req.body;

      const venta = await ventaService.createVenta({
        clienteId,
        usuarioId,
        sucursalId,
        productos
      });

      res.json({
        success: true,
        data: venta
      });

    } catch (error) {
      next(error);
    }
  },

  async getVentas(req, res, next) {
    try {
      const { usuarioId, clienteId, sucursalId } = req.query;

      const ventas = await ventaService.getVentas({
        usuarioId,
        clienteId,
        sucursalId
      });

      res.json({
        success: true,
        data: ventas
      });

    } catch (error) {
      next(error);
    }
  },

  async getVentaById(req, res, next) {
    try {
      const { id } = req.params;
      const venta = await ventaService.getVentaById(id);

      res.json({
        success: true,
        data: venta
      });

    } catch (error) {
      next(error);
    }
  }

};

export default ventaController;
