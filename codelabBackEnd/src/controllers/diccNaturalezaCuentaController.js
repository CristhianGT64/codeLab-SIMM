import diccNaturalezaCuentaService from '../services/diccNaturalezaCuentaService.js';

const diccNaturalezaCuentaController = {
  async create(req, res, next) {
    try {
      const data = await diccNaturalezaCuentaService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Naturaleza contable creada correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async list(req, res, next) {
    try {
      const data = await diccNaturalezaCuentaService.list(req.query);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async getById(req, res, next) {
    try {
      const data = await diccNaturalezaCuentaService.getById(req.params.id);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const data = await diccNaturalezaCuentaService.update(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Naturaleza contable actualizada correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async patch(req, res, next) {
    try {
      const data = await diccNaturalezaCuentaService.patchEstado(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Estado de la naturaleza contable actualizado correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },
};

export default diccNaturalezaCuentaController;