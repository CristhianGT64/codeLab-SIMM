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
};

export default impuestoController;
