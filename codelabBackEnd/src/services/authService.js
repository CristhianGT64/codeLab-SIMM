import bcrypt from 'bcryptjs';
import authRepository from '../repositories/authRepository.js';

const authService = {
  async login({ login, password }) {
    if (!login || !password) {
      const error = new Error('Campos requeridos: login (correo o usuario) y password');
      error.status = 400;
      throw error;
    }

    const user = await authRepository.findUserForLogin(login);

    if (!user) {
      const error = new Error('Credenciales inválidas o usuario no habilitado.');
      error.status = 401;
      throw error;
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      const error = new Error('Credenciales inválidas o usuario no habilitado.');
      error.status = 401;
      throw error;
    }

    const { password: _pw, ...safeUser } = user;
    return safeUser;
  },
};

export default authService;