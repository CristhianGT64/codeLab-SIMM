import ventaService from "../services/ventaService.js";

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
      const { usuarioId, clienteId } = req.query;

      const ventas = await ventaService.getVentas({
        usuarioId,
        clienteId
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

      if (!venta) {
        throw new Error("Venta no encontrada");
      }

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
