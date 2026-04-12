import impuestoService from '../services/impuestoService.js';

const impuestoController = {
  async list(req, res, next) {
    try {
      const data = await impuestoService.list();
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      const data = await impuestoService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Impuesto registrado correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const data = await impuestoService.update(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Impuesto actualizado correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },
};

export default impuestoController;
