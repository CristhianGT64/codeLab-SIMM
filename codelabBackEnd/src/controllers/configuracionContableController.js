import configuracionContableService from '../services/configuracionContableService.js';

const configuracionContableController = {
  async getMetodoInventario(req, res, next) {
    try {
      const data = await configuracionContableService.getMetodoInventario();

      res.json({
        success: true,
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async updateMetodoInventario(req, res, next) {
    try {
      const data = await configuracionContableService.updateMetodoInventario(req.body);

      res.json({
        success: true,
        message: 'Método de valuación de inventario actualizado correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async opciones(req, res, next) {
    try {
      res.json({
        success: true,
        data: configuracionContableService.metodosValidos(),
      });
    } catch (e) {
      next(e);
    }
  },
};

export default configuracionContableController;