import rolService from '../services/rolService.js';

const rolController = {
  async getAll(req, res, next) {
    try {
      const data = await rolService.getAll();
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      const data = await rolService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (e) {
      // unique duplicado
      if (e?.code === 'P2002') {
        return res.status(409).json({ success: false, message: 'El rol ya existe (nombre duplicado).' });
      }
      next(e);
    }
  },
};

export default rolController;