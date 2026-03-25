import elementoContableService from '../services/elementoContableService.js';

const elementoContableController = {
  async create(req, res, next) {
    try {
      const data = await elementoContableService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Elemento contable creado correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async list(req, res, next) {
    try {
      const data = await elementoContableService.list(req.query);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async getById(req, res, next) {
    try {
      const data = await elementoContableService.getById(req.params.id);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const data = await elementoContableService.update(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Elemento contable actualizado correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async patch(req, res, next) {
    try {
      const data = await elementoContableService.patchEstado(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Estado del elemento contable actualizado correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },
};

export default elementoContableController;