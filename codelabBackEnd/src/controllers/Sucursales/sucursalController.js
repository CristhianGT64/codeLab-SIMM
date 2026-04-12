import sucursalService from '../../services/Sucursales/sucursalService.js';

/**
 * Controlador para manejar las solicitudes relacionadas con sucursales.
 */
const sucursalController = {

  /**
   * Obtiene todas las sucursales
   * GET /sucursales
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función next de Express
   * Observación: Permite un parámetro de consulta opcional "search" para filtrar por nombre o dirección.
   */
  async getAllSucursales(req, res, next) {
    try {
      const search = req.query.search || '';
      const sucursales = await sucursalService.getAll(search);
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
   * GET /sucursales/:id
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función next de Express
   * Observación: El ID se espera como un parámetro de ruta. Si la sucursal no existe, se lanza un error 404.
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
   * POST /sucursales
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función next de Express
   * Observación: Se espera un cuerpo JSON con los datos de la sucursal. Si faltan campos obligatorios, se lanza un error 400.
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
   * PUT /sucursales/:id
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función next de Express
   * Observación: El ID se espera como un parámetro de ruta. Se espera un cuerpo JSON con los datos a actualizar. Si la sucursal no existe, se lanza un error 404.
   */
  async updateSucursal(req, res, next) {
    try {
      const { id } = req.params;
      // remove any accidental id field from body to avoid conflicts
      const { id: _ignored, ...data } = req.body;
      // log for troubleshooting
      console.log('Updating sucursal', id, data);
      const sucursal = await sucursalService.update(
        Number.parseInt(id, 10),
        data
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
   * PATCH /sucursales/:id/estado
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función next de Express
   * Observación: El ID se espera como un parámetro de ruta. Se espera un cuerpo JSON con el campo "activo" (boolean). Si la sucursal no existe, se lanza un error 404.
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