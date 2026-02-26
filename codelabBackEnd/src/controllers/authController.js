import authService from '../services/authService.js';

const authController = {
  async login(req, res, next) {
    try {
      const data = await authService.login(req.body);
      res.json({ success: true, message: 'Login exitoso', data });
    } catch (e) {
      next(e);
    }
  },
};

export default authController;