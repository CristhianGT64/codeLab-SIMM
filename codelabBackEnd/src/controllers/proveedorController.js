import proveedorService from '../services/proveedorService.js';

const proveedorController = {
  async create(req, res, next) {
    try {
      const data = await proveedorService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Proveedor creado correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async list(req, res, next) {
    try {
      const data = await proveedorService.getAll(req.query);

      res.json({
        success: true,
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async getById(req, res, next) {
    try {
      const data = await proveedorService.getById(req.params.id);

      res.json({
        success: true,
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const data = await proveedorService.update(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Proveedor actualizado correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async patch(req, res, next) {
    try {
      const data = await proveedorService.patchDisponibilidad(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Estado del proveedor actualizado correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      await proveedorService.remove(req.params.id);

      res.json({
        success: true,
        message: 'Proveedor desactivado correctamente.',
      });
    } catch (e) {
      next(e);
    }
  },
};

export default proveedorController;