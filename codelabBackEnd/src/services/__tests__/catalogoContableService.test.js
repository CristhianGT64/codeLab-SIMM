import catalogoContableService from '../catalogoContableService.js';
import catalogoContableRepository from '../../repositories/catalogoContableRepository.js';

jest.mock('../../repositories/catalogoContableRepository.js');

describe('catalogoContableService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getArbol', () => {
    it('debe retornar el árbol contable (happy path)', async () => {
      const data = {
        elementos: [{ uuidElementoContable: 'e1', codigoNumerico: 1 }],
        clasificaciones: [{ uuidElementoContable: 'e1', uuidClasificacionContable: 'c1', codigoNumerico: 1 }],
        cuentas: [{ uuidElementoContable: 'e1', uuidClasificacionContable: 'c1', uuidCuentaContable: 'cu1', codigoNumerico: 1 }],
        subcuentas: [{ uuidCuentaContable: 'cu1', codigoNumerico: 1 }],
      };
      catalogoContableRepository.getAllData.mockResolvedValue(data);
      const result = await catalogoContableService.getArbol();
      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toHaveProperty('clasificaciones');
    });
    it('debe manejar error de base de datos', async () => {
      catalogoContableRepository.getAllData.mockRejectedValue(new Error('DB error'));
      await expect(catalogoContableService.getArbol()).rejects.toThrow('DB error');
    });
  });

  describe('getResumen', () => {
    it('debe retornar el resumen (happy path)', async () => {
      const data = {
        elementos: [{}, {}],
        clasificaciones: [{}],
        cuentas: [{}, {}, {}],
        subcuentas: [{}],
      };
      catalogoContableRepository.getAllData.mockResolvedValue(data);
      const result = await catalogoContableService.getResumen();
      expect(result).toEqual({
        totalElementos: 2,
        totalClasificaciones: 1,
        totalCuentas: 3,
        totalSubcuentas: 1,
      });
    });
    it('debe manejar error de base de datos', async () => {
      catalogoContableRepository.getAllData.mockRejectedValue(new Error('DB error'));
      await expect(catalogoContableService.getResumen()).rejects.toThrow('DB error');
    });
  });
});
