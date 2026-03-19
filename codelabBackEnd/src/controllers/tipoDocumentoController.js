import tipoDocumentoService from '../services/tipoDocumentoService.js';

/**
 * Controlador para manejar las solicitudes relacionadas con tipos de documento.
 */

const tipoDocumentoController = {
  /**
   * GET /tipos-documento maestro.
   * Obtiene todos los tipos de documento de la tabla maestra (sin relación con establecimientos).
   * @return {Promise<void>}
   */
  async getAllTiposDocumento(req, res, next) {
    try {
      const tipos = await tipoDocumentoService.getAll();
      res.json({
        success: true,
        data: tipos,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /tipos-documento/:id
   * Obtiene un tipo de documento por ID (de la tabla maestra, sin relación con establecimientos).
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función para pasar el control al siguiente middleware
   * @returns {Promise<void>}
   */
  async getTipoDocumentoById(req, res, next) {
    try {
      const { id } = req.params;
      const tipo = await tipoDocumentoService.getById(BigInt(id));
      res.json({
        success: true,
        data: tipo,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /tipos-documento
   * Crea un nuevo tipo de documento en la tabla maestra.
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función para pasar el control al siguiente middleware
   * @returns {Promise<void>}
   */
  async createTipoDocumento(req, res, next) {
    try {
      const tipo = await tipoDocumentoService.create(req.body);
      res.status(201).json({
        success: true,
        data: tipo,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /tipos-documento/:id
   * Actualiza un tipo de documento en la tabla maestra.
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función para pasar el control al siguiente middleware
   * @returns {Promise<void>}
   */
  async updateTipoDocumento(req, res, next) {
    try {
      const { id } = req.params;
      const { id: _ignored, ...data } = req.body;
      const tipo = await tipoDocumentoService.update(BigInt(id), data);
      res.json({
        success: true,
        data: tipo,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /tipos-documento/:id/estado
   * Cambia el estado (disponible) de un tipo de documento maestro. Si se desactiva, también se desactivan en cascada todas las asignaciones de ese documento en los establecimientos (disponible=false).
   * Si se activa (true) → no se reactivan automáticamente las asignaciones.
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función next de Express
   * @returns {Promise<void>}
   */
  async changeTipoDocumentoStatus(req, res, next) {
    try {
      const { id } = req.params;
      const tipo = await tipoDocumentoService.changeStatus(BigInt(id));

      res.json({
        success: true,
        message: tipo.disponible
          ? 'Tipo de documento activado exitosamente'
          : 'Tipo de documento desactivado exitosamente',
        data: tipo,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /establecimientos/:id/documentos
   * Obtiene los tipos de documento asignados a un establecimiento específico, incluyendo su estado (disponible) en ese establecimiento.
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función para pasar el control al siguiente middleware
   * @returns {Promise<void>}
   */
  async getDocumentosByEstablecimiento(req, res, next) {
    try {
      const { id } = req.params;
      const docs = await tipoDocumentoService.getByEstablecimiento(BigInt(id));
      res.json({
        success: true,
        data: docs,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /establecimiento-documento/:id/estado
   * Cambia el estado (disponible) de un tipo de documento en un establecimiento específico.
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función para pasar el control al siguiente middleware
   * @returns {Promise<void>}
   */
  async patchEstadoEstablecimientoDocumento(req, res, next) {
    try {
      const { id } = req.params;
      const { disponible } = req.body;

      if (!/^\d+$/.test(id)) {
        return res.status(400).json({
          success: false,
          error: { message: 'id_establecimiento_tipo_documento inválido' },
        });
      }

      const data = await tipoDocumentoService.patchEstadoEstablecimientoDocumento(
        BigInt(id),
        Boolean(disponible)
      );

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /establecimientos/:id/documentos
   * Asigna un tipo de documento maestro a un establecimiento
   */
  async assignDocumentoToEstablecimiento(req, res, next) {
    try {
      const { id } = req.params; // id_establecimiento
      const { id_tipo_documento } = req.body;

      const data = await tipoDocumentoService.assignDocumento(
        BigInt(id),
        BigInt(id_tipo_documento)
      );

      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default tipoDocumentoController;