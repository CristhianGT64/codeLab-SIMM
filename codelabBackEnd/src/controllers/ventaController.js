import ventaService from "../services/ventaService.js";

const ventaController = {

  async createVenta(req, res, next) {

    try {

      const venta = await ventaService.createVenta({
        ...req.body,
        usuarioId: req.user?.id ?? null,
        sucursalId: req.user?.sucursalId ?? req.body.sucursalId
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

      const ventas = await ventaService.getVentas();

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

      const venta = await ventaService.getVentaById(req.params.id);

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