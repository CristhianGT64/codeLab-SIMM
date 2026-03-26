import clasificacionElementoContableService from '../services/clasificacionElementoContableService.js';

const clasificacionElementoContableController = {
  async create(req, res, next) {
    try {
      const data = await clasificacionElementoContableService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Clasificación contable creada correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async list(req, res, next) {
    try {
      const data = await clasificacionElementoContableService.list(req.query);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async getById(req, res, next) {
    try {
      const data = await clasificacionElementoContableService.getById(req.params.id);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const data = await clasificacionElementoContableService.update(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Clasificación contable actualizada correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async patch(req, res, next) {
    try {
      const data = await clasificacionElementoContableService.patchEstado(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Estado de la clasificación contable actualizado correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },
};

export default clasificacionElementoContableController;