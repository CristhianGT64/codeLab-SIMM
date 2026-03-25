import cuentaContableService from '../services/cuentaContableService.js';

const cuentaContableController = {
  async create(req, res, next) {
    try {
      const data = await cuentaContableService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Cuenta contable creada correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async list(req, res, next) {
    try {
      const data = await cuentaContableService.list(req.query);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async getById(req, res, next) {
    try {
      const data = await cuentaContableService.getById(req.params.id);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const data = await cuentaContableService.update(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Cuenta contable actualizada correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async patch(req, res, next) {
    try {
      const data = await cuentaContableService.patchEstado(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Estado de la cuenta contable actualizado correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },
};

export default cuentaContableController;