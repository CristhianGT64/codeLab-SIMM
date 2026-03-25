import catalogoContableService from '../services/catalogoContableService.js';

const catalogoContableController = {
  async arbol(req, res, next) {
    try {
      const data = await catalogoContableService.getArbol();
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async resumen(req, res, next) {
    try {
      const data = await catalogoContableService.getResumen();
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },
};

export default catalogoContableController;