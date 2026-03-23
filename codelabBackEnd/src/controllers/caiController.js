import caiService from '../services/caiService.js';

const caiController = {
  async create(req, res, next) {
    try {
      const data = await caiService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'CAI creado correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async list(req, res, next) {
    try {
      const data = await caiService.listAll();

      res.json({
        success: true,
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async latestVigente(req, res, next) {
    try {
      const data = await caiService.getLatestVigente();

      res.json({
        success: true,
        data,
      });
    } catch (e) {
      next(e);
    }
  },
};

export default caiController;