import configuracionContableService from '../configuracionContableService.js';
import configuracionContableRepository from '../../repositories/configuracionContableRepository.js';
import periodoContableRepository from '../../repositories/periodoContableRepository.js';

jest.mock('../../repositories/configuracionContableRepository.js');
jest.mock('../../repositories/periodoContableRepository.js');

describe('configuracionContableService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMetodoInventario', () => {
    it('debe retornar la configuración existente (happy path)', async () => {
      const config = { id: 1, metodoValuacion: 'FIFO', monedaFuncional: 'HNL' };
      configuracionContableRepository.findFirst.mockResolvedValue(config);
      const result = await configuracionContableService.getMetodoInventario();
      expect(result).toEqual(config);
    });
    it('debe crear y retornar configuración si no existe', async () => {
      configuracionContableRepository.findFirst.mockResolvedValue(null);
      const config = { id: 1, metodoValuacion: 'FIFO', monedaFuncional: 'HNL' };
      configuracionContableRepository.create.mockResolvedValue(config);
      const result = await configuracionContableService.getMetodoInventario();
      expect(result).toEqual(config);
    });
    it('debe manejar error de base de datos', async () => {
      configuracionContableRepository.findFirst.mockRejectedValue(new Error('DB error'));
      await expect(configuracionContableService.getMetodoInventario()).rejects.toThrow('DB error');
    });
  });

  describe('updateMetodoInventario', () => {
    it('debe actualizar el método de inventario (happy path)', async () => {
      const actual = { id: 1, metodoValuacion: 'FIFO', monedaFuncional: 'HNL' };
      configuracionContableRepository.findFirst.mockResolvedValue(actual);
      configuracionContableRepository.update.mockResolvedValue({ ...actual, metodoValuacion: 'PROMEDIO_PONDERADO' });
      const result = await configuracionContableService.updateMetodoInventario({ metodoValuacion: 'PROMEDIO_PONDERADO' });
      expect(result).toEqual({ ...actual, metodoValuacion: 'PROMEDIO_PONDERADO' });
    });
    it('debe lanzar error si el body es inválido', async () => {
      await expect(configuracionContableService.updateMetodoInventario(null)).rejects.toThrow('Body inválido');
    });
    it('debe lanzar error si falta metodoValuacion', async () => {
      configuracionContableRepository.findFirst.mockResolvedValue({ id: 1, metodoValuacion: 'FIFO', monedaFuncional: 'HNL' });
      await expect(configuracionContableService.updateMetodoInventario({})).rejects.toThrow('metodoValuacion es obligatorio');
    });
    it('debe lanzar error si metodoValuacion es inválido', async () => {
      configuracionContableRepository.findFirst.mockResolvedValue({ id: 1, metodoValuacion: 'FIFO', monedaFuncional: 'HNL' });
      await expect(configuracionContableService.updateMetodoInventario({ metodoValuacion: 'INVALIDO' })).rejects.toThrow('metodoValuacion inválido');
    });
    it('debe lanzar error si existen periodos cerrados y se cambia el método', async () => {
      const actual = { id: 1, metodoValuacion: 'FIFO', monedaFuncional: 'HNL' };
      configuracionContableRepository.findFirst.mockResolvedValue(actual);
      periodoContableRepository.existsClosedPeriods.mockResolvedValue(true);
      await expect(configuracionContableService.updateMetodoInventario({ metodoValuacion: 'PROMEDIO_PONDERADO' })).rejects.toThrow('No se puede cambiar el metodo de valuacion');
    });
    it('debe lanzar error si monedaFuncional es vacía', async () => {
      const actual = { id: 1, metodoValuacion: 'FIFO', monedaFuncional: 'HNL' };
      configuracionContableRepository.findFirst.mockResolvedValue(actual);
      await expect(configuracionContableService.updateMetodoInventario({ metodoValuacion: 'FIFO', monedaFuncional: '' })).rejects.toThrow('monedaFuncional no puede estar vacía');
    });
    it('debe lanzar error si monedaFuncional es muy larga', async () => {
      const actual = { id: 1, metodoValuacion: 'FIFO', monedaFuncional: 'HNL' };
      configuracionContableRepository.findFirst.mockResolvedValue(actual);
      await expect(configuracionContableService.updateMetodoInventario({ metodoValuacion: 'FIFO', monedaFuncional: 'ABCDEFGHIJKL' })).rejects.toThrow('monedaFuncional no puede tener más de 10 caracteres');
    });
    it('debe manejar error de base de datos', async () => {
      configuracionContableRepository.findFirst.mockResolvedValue({ id: 1, metodoValuacion: 'FIFO', monedaFuncional: 'HNL' });
      configuracionContableRepository.update.mockRejectedValue(new Error('DB error'));
      await expect(configuracionContableService.updateMetodoInventario({ metodoValuacion: 'FIFO' })).rejects.toThrow('DB error');
    });
  });

  describe('metodosValidos', () => {
    it('debe retornar los métodos válidos', () => {
      expect(configuracionContableService.metodosValidos()).toEqual(['FIFO', 'PROMEDIO_PONDERADO']);
    });
  });
});
