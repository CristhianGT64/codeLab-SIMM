import sucursalService from '../services/sucursalService.js';

/**
 * Controlador para manejar las solicitudes relacionadas con sucursales
 */
const sucursalController = {

  /**
   * Obtiene todas las sucursales
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función next de Express
   */
  async getAllSucursales(req, res, next) {
    try {
      const sucursales = await sucursalService.getAll();
      res.json({
        success: true,
        data: sucursales,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtiene una sucursal por su ID
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función next de Express
   */
  async getSucursalById(req, res, next) {
    try {
      const { id } = req.params;
      const sucursal = await sucursalService.getById(Number.parseInt(id, 10));
      res.json({
        success: true,
        data: sucursal,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Crea una nueva sucursal
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función next de Express
   */
  async createSucursal(req, res, next) {
    try {
      const sucursal = await sucursalService.create(req.body);
      res.status(201).json({
        success: true,
        data: sucursal,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Actualiza una sucursal existente
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función next de Express
   */
  async updateSucursal(req, res, next) {
    try {
      const { id } = req.params;
      const sucursal = await sucursalService.update(
        Number.parseInt(id, 10),
        req.body
      );
      res.json({
        success: true,
        data: sucursal,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Activa o desactiva una sucursal (eliminación lógica)
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función next de Express
   */
  async changeSucursalStatus(req, res, next) {
    try {
      const { id } = req.params;
      const sucursal = await sucursalService.changeStatus(
        Number.parseInt(id, 10)
      );

      res.json({
        success: true,
        message: sucursal.activo
          ? 'Sucursal activada exitosamente'
          : 'Sucursal desactivada exitosamente',
        data: sucursal,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default sucursalController;