import usuarioService from '../services/usuarioService.js';

const usuarioController = {
  async create(req, res, next) {
    try {
      const data = await usuarioService.create(req.body);

      // Si restauró, el service devuelve el usuario igual.
      // Mantengo tu comportamiento: si restauró debería ser 200; aquí no lo distinguimos.
      // Si quieres distinguir restauración, se puede retornar un flag desde el service.
      res.status(201).json({ success: true, data });
    } catch (e) {
      if (e?.code === 'P2002') {
        return res.status(409).json({ success: false, message: 'Correo o usuario duplicado.' });
      }
      next(e);
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await usuarioService.getAll();
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const data = await usuarioService.update(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (e) {
      if (e?.code === 'P2002') {
        return res.status(409).json({ success: false, message: 'Correo o usuario duplicado.' });
      }
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      await usuarioService.remove(req.params.id);
      res.json({ success: true, message: 'Usuario eliminado correctamente.' });
    } catch (e) {
      next(e);
    }
  },
};

export default usuarioController;