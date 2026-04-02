import tipoClienteService from '../../services/Tipos de cliente/tipoClienteService.js';

/**
 * Controlador para manejar las solicitudes relacionadas con tipos de cliente.
 */

const tipoClienteController = {

    /**
     * GET /tipos-cliente
     * Obtiene todos los tipos de cliente registrados.
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     * @param {Function} next - Función next de Express para manejo de errores
     * Observación: Permite un parámetro de consulta opcional "search" para filtrar por nombre o descripción.
     */
  async getAlltiposdecliente(req, res, next) {
    try {
      const search = req.query.search || '';
      const tipos = await tipoClienteService.getAll(search);
      res.json({
        success: true,
        data: tipos,
      });
    } catch (error) {
      next(error);
    }
  },

      /**
     * GET /tipos-cliente/:id
     * Obtiene un tipo de cliente específico por su ID.
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     * @param {Function} next - Función next de Express para manejo de errores
     * Observación: El ID se espera como un parámetro de ruta. Si el tipo de cliente no existe, se lanza un error 404.
     */
  async getByIdtiposdecliente(req, res, next) {
    try {
      const { id } = req.params;
      const tipo = await tipoClienteService.getById(id);
      res.json({
        success: true,
        data: tipo,
      });
    } catch (error) {
      next(error);
    }
  },

     /**
     * POST /tipos-cliente
     * Crea un nuevo tipo de cliente.
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     * @param {Function} next - Función next de Express para manejo de errores
     * Observación: El cuerpo de la solicitud debe contener al menos el campo "nombre". Si el nombre ya existe, se lanza un error 400.
     */
  async createtipodecliente(req, res, next) {
    try {
      const tipo = await tipoClienteService.create(req.body);
      res.status(201).json({
        success: true,
        data: tipo,
      });
    } catch (error) {
      next(error);
    }
  },

    /**
     * PUT /tipos-cliente/:id
     * Actualiza un tipo de cliente existente.
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     * @param {Function} next - Función next de Express para manejo de errores
     * Observación: El ID se espera como un parámetro de ruta. El cuerpo de la solicitud puede contener campos a actualizar. Si el tipo de cliente no existe, se lanza un error 404. Si el nuevo nombre ya existe en otro registro, se lanza un error 400.
     */
  async updatetipodecliente(req, res, next) {
    try {
      const { id } = req.params;
      const { id: _ignored, ...data } = req.body;
      const tipo = await tipoClienteService.update(id, data);
      res.json({
        success: true,
        data: tipo,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
     * PATCH /tipos-cliente/:id/estado
     * Activa o desactiva un tipo de cliente.
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     * @param {Function} next - Función next de Express para manejo de errores
     * Observación: El ID se espera como un parámetro de ruta. El cuerpo de la solicitud debe contener el campo "disponible" como un valor booleano. Si el tipo de cliente no existe, se lanza un error 404.
     */
  async cambiartipodeclienteEstado(req, res, next) {
    try {
      const { id } = req.params;
      const { disponible } = req.body;

      if (typeof disponible !== 'boolean') {
        const error = new Error('El campo "disponible" debe ser un valor booleano');
        error.status = 400;
        throw error;
      }

      const tipo = await tipoClienteService.cambiartipodeclienteEstado(id, disponible);
      res.json({
        success: true,
        data: tipo,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default tipoClienteController;
