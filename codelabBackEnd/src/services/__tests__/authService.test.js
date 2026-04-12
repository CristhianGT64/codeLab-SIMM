import authService from '../authService.js';
import authRepository from '../../repositories/authRepository.js';
import bcrypt from 'bcryptjs';

jest.mock('../../repositories/authRepository.js');
jest.mock('bcryptjs');

describe('authService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debe autenticar correctamente (happy path)', async () => {
      const user = {
        id: 1,
        login: 'test',
        password: 'hashed',
        rol: { rolPermisos: [{ permiso: { nombre: 'ADMIN' } }] },
      };
      authRepository.findUserForLogin.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      const result = await authService.login({ login: 'test', password: '1234' });
      expect(result).toEqual({
        id: 1,
        login: 'test',
        rol: { rolPermisos: [{ permiso: { nombre: 'ADMIN' } }] },
        permissions: ['ADMIN'],
      });
    });

    it('debe lanzar error si faltan campos requeridos', async () => {
      await expect(authService.login({ login: '', password: '' })).rejects.toThrow('Campos requeridos');
    });

    it('debe lanzar error si el usuario no existe', async () => {
      authRepository.findUserForLogin.mockResolvedValue(null);
      await expect(authService.login({ login: 'test', password: '1234' })).rejects.toThrow('Credenciales inválidas');
    });

    it('debe lanzar error si la contraseña es incorrecta', async () => {
      const user = { id: 1, login: 'test', password: 'hashed', rol: { rolPermisos: [] } };
      authRepository.findUserForLogin.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);
      await expect(authService.login({ login: 'test', password: 'wrong' })).rejects.toThrow('Credenciales inválidas');
    });

    it('debe manejar error de base de datos', async () => {
      authRepository.findUserForLogin.mockRejectedValue(new Error('DB error'));
      await expect(authService.login({ login: 'test', password: '1234' })).rejects.toThrow('DB error');
    });

    it('debe manejar error de bcrypt', async () => {
      const user = { id: 1, login: 'test', password: 'hashed', rol: { rolPermisos: [] } };
      authRepository.findUserForLogin.mockResolvedValue(user);
      bcrypt.compare.mockRejectedValue(new Error('bcrypt error'));
      await expect(authService.login({ login: 'test', password: '1234' })).rejects.toThrow('bcrypt error');
    });
  });
});
