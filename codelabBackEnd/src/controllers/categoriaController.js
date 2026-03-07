import categoriaService from '../services/categoriaService.js';

const categoriaController = {
  async list(req, res, next) {
    try {
      const data = await categoriaService.list();
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async getById(req, res, next) {
    try {
      const data = await categoriaService.getById(req.params.id);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      const data = await categoriaService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Categoría guardada correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const data = await categoriaService.update(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Categoría actualizada correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async patch(req, res, next) {
    try {
      const data = await categoriaService.patch(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Categoría actualizada correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      await categoriaService.remove(req.params.id);
      res.json({
        success: true,
        message: 'Categoría deshabilitada correctamente.',
      });
    } catch (e) {
      next(e);
    }
  },
};

export default categoriaController;