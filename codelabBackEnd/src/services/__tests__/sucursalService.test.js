import * as sucursalRepository from '../../repositories/Sucursales/sucursalRepository.js';
import sucursalService from '../Sucursales/sucursalService.js';

jest.mock('../../repositories/Sucursales/sucursalRepository.js', () => ({
  getAllSucursales: jest.fn(),
  getSucursalById: jest.fn(),
  createSucursal: jest.fn(),
  updateSucursal: jest.fn(),
  updateSucursalStatus: jest.fn(),
}));

describe('sucursalService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('debe retornar todas las sucursales (happy path)', async () => {
      const sucursales = [{ id: 1, nombre: 'Sucursal 1' }];
      sucursalRepository.getAllSucursales.mockResolvedValue(sucursales);
      const result = await sucursalService.getAll();
      expect(result).toEqual(sucursales);
    });

    it('debe manejar error de base de datos', async () => {
      sucursalRepository.getAllSucursales.mockRejectedValue(new Error('DB error'));
      await expect(sucursalService.getAll()).rejects.toThrow('DB error');
    });
  });

  describe('getById', () => {
    it('debe retornar la sucursal por id (happy path)', async () => {
      const sucursal = { id: 1, nombre: 'Sucursal 1' };
      sucursalRepository.getSucursalById.mockResolvedValue(sucursal);
      const result = await sucursalService.getById(1);
      expect(result).toEqual(sucursal);
    });

    it('debe lanzar error si no existe la sucursal', async () => {
      sucursalRepository.getSucursalById.mockResolvedValue(null);
      await expect(sucursalService.getById(1)).rejects.toThrow('Sucursal no encontrada');
    });

    it('debe manejar error de base de datos', async () => {
      sucursalRepository.getSucursalById.mockRejectedValue(new Error('DB error'));
      await expect(sucursalService.getById(1)).rejects.toThrow('DB error');
    });
  });

  describe('create', () => {
    it('debe crear una sucursal (happy path)', async () => {
      const data = { nombre: 'Sucursal Nueva' };
      const created = { id: 2, ...data };
      sucursalRepository.createSucursal.mockResolvedValue(created);
      const result = await sucursalService.create(data);
      expect(result).toEqual(created);
    });

    it('debe manejar error de validación', async () => {
      sucursalRepository.createSucursal.mockImplementation(() => { throw new Error('Datos inválidos'); });
      await expect(sucursalService.create({})).rejects.toThrow('Datos inválidos');
    });

    it('debe manejar error de base de datos', async () => {
      sucursalRepository.createSucursal.mockRejectedValue(new Error('DB error'));
      await expect(sucursalService.create({ nombre: 'Sucursal' })).rejects.toThrow('DB error');
    });
  });

  describe('update', () => {
    it('debe actualizar una sucursal (happy path)', async () => {
      const id = 1;
      const data = { nombre: 'Actualizada' };
      const sucursal = { id, nombre: 'Sucursal 1' };
      const updated = { id, ...data };
      sucursalRepository.getSucursalById.mockResolvedValue(sucursal);
      sucursalRepository.updateSucursal.mockResolvedValue(updated);
      const result = await sucursalService.update(id, data);
      expect(result).toEqual(updated);
    });

    it('debe lanzar error si la sucursal no existe', async () => {
      sucursalRepository.getSucursalById.mockResolvedValue(null);
      await expect(sucursalService.update(1, {})).rejects.toThrow('Sucursal no encontrada');
    });

    it('debe manejar error de base de datos', async () => {
      const id = 1;
      const data = { nombre: 'Actualizada' };
      const sucursal = { id, nombre: 'Sucursal 1' };
      sucursalRepository.getSucursalById.mockResolvedValue(sucursal);
      sucursalRepository.updateSucursal.mockRejectedValue(new Error('DB error'));
      await expect(sucursalService.update(id, data)).rejects.toThrow('DB error');
    });
  });

  describe('changeStatus', () => {
    it('debe cambiar el estado de la sucursal (happy path)', async () => {
      const id = 1;
      const sucursal = { id, activa: true };
      const updated = { id, activa: false };
      sucursalRepository.getSucursalById.mockResolvedValue(sucursal);
      sucursalRepository.updateSucursalStatus.mockResolvedValue(updated);
      const result = await sucursalService.changeStatus(id);
      expect(result).toEqual(updated);
    });

    it('debe lanzar error si la sucursal no existe', async () => {
      sucursalRepository.getSucursalById.mockResolvedValue(null);
      await expect(sucursalService.changeStatus(1)).rejects.toThrow('Sucursal no encontrada');
    });

    it('debe manejar error de base de datos', async () => {
      const id = 1;
      const sucursal = { id, activa: true };
      sucursalRepository.getSucursalById.mockResolvedValue(sucursal);
      sucursalRepository.updateSucursalStatus.mockRejectedValue(new Error('DB error'));
      await expect(sucursalService.changeStatus(id)).rejects.toThrow('DB error');
    });
  });
});
