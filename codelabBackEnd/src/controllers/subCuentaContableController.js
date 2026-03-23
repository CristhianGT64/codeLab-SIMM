import subCuentaContableService from '../services/subCuentaContableService.js';

const subCuentaContableController = {
  async create(req, res, next) {
    try {
      const data = await subCuentaContableService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Subcuenta contable creada correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async list(req, res, next) {
    try {
      const data = await subCuentaContableService.list(req.query);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async getById(req, res, next) {
    try {
      const data = await subCuentaContableService.getById(req.params.id);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const data = await subCuentaContableService.update(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Subcuenta contable actualizada correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async patch(req, res, next) {
    try {
      const data = await subCuentaContableService.patchEstado(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Estado de la subcuenta contable actualizado correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },
};

export default subCuentaContableController;