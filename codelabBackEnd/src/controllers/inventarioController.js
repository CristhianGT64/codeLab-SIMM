import inventarioService from '../services/inventarioService.js';

const inventarioController = {
  async registrarEntrada(req, res, next) {
    try {
      const data = await inventarioService.registrarEntrada(req.body);

      res.status(201).json({
        success: true,
        message: 'Entrada de inventario registrada correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async registrarSalida(req, res, next) {
    try {
      const data = await inventarioService.registrarSalida(req.body);

      res.status(201).json({
        success: true,
        message: 'Salida de inventario registrada correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async historial(req, res, next) {
    try {
      const data = await inventarioService.historial(req.query);

      res.json({
        success: true,
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async historialPorProducto(req, res, next) {
    try {
      const data = await inventarioService.historialPorProducto(
        req.params.productoId,
        req.query.sucursalId
      );

      res.json({
        success: true,
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async dashboard(req, res, next) {
    try {
      const data = await inventarioService.dashboard(req.query);
      res.json({
        success: true,
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async tiposEntrada(req, res, next) {
    try {
      res.json({
        success: true,
        data: inventarioService.tiposEntrada(),
      });
    } catch (e) {
      next(e);
    }
  },

  async motivosSalida(req, res, next) {
    try {
      res.json({
        success: true,
        data: inventarioService.motivosSalida(),
      });
    } catch (e) {
      next(e);
    }
  },
};

export default inventarioController;