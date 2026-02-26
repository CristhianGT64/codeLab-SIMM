import sucursalService from '../services/sucursalService.js';

const sucursalController = {
  async getAll(req, res, next) {
    try {
      const data = await sucursalService.getAll();
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      const data = await sucursalService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },
};

export default sucursalController;