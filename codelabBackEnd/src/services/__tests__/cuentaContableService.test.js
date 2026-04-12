import cuentaContableService from '../cuentaContableService.js';
import cuentaContableRepository from '../../repositories/cuentaContableRepository.js';
import elementoContableRepository from '../../repositories/elementoContableRepository.js';
import clasificacionElementoContableRepository from '../../repositories/clasificacionElementoContableRepository.js';
import diccNaturalezaCuentaRepository from '../../repositories/diccNaturalezaCuentaRepository.js';
import prisma from '../../infra/prisma/prismaClient.js';

jest.mock('../../repositories/cuentaContableRepository.js');
jest.mock('../../repositories/elementoContableRepository.js');
jest.mock('../../repositories/clasificacionElementoContableRepository.js');
jest.mock('../../repositories/diccNaturalezaCuentaRepository.js');
jest.mock('../../infra/prisma/prismaClient.js', () => ({
  cuentaContable: { aggregate: jest.fn(), updateMany: jest.fn() },
  subCuentaContable: { updateMany: jest.fn() },
  clasificacionElementoContable: { updateMany: jest.fn() },
}));

// Mock explícito de prisma y sus métodos anidados usados en los tests
import actualPrisma from '../../infra/prisma/prismaClient.js';
beforeAll(() => {
  actualPrisma.cuentaContable = { aggregate: jest.fn() };
  actualPrisma.subCuentaContable = { updateMany: jest.fn() };
});

describe('cuentaContableService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('debe retornar la lista de cuentas (happy path)', async () => {
      const cuentas = [{ id: 1, nombre: 'Cuenta 1' }];
      cuentaContableRepository.list.mockResolvedValue(cuentas);
      const result = await cuentaContableService.list();
      expect(result).toEqual(cuentas);
    });
    it('debe manejar error de base de datos', async () => {
      cuentaContableRepository.list.mockRejectedValue(new Error('DB error'));
      await expect(cuentaContableService.list()).rejects.toThrow('DB error');
    });
  });

  describe('getById', () => {
    it('debe retornar la cuenta por id (happy path)', async () => {
      const cuenta = { id: 1, nombre: 'Cuenta 1' };
      cuentaContableRepository.findById.mockResolvedValue(cuenta);
      const result = await cuentaContableService.getById(1);
      expect(result).toEqual(cuenta);
    });
    it('debe lanzar error si no existe la cuenta', async () => {
      cuentaContableRepository.findById.mockResolvedValue(null);
      await expect(cuentaContableService.getById(1)).rejects.toThrow('Cuenta contable no encontrada');
    });
    it('debe manejar error de base de datos', async () => {
      cuentaContableRepository.findById.mockRejectedValue(new Error('DB error'));
      await expect(cuentaContableService.getById(1)).rejects.toThrow('DB error');
    });
  });

  describe('create', () => {
    it('debe crear una cuenta contable (happy path)', async () => {
      const payload = {
        nombre: 'Cuenta',
        uuidElementoContable: 'e1',
        uuidClasificacionContable: 'c1',
        idNaturaleza: 1n, // BigInt para coincidir con la lógica del servicio
      };
      diccNaturalezaCuentaRepository.findById.mockResolvedValue({ id: 1n });
      elementoContableRepository.findByUuid.mockResolvedValue({ idNaturaleza: 1n });
      clasificacionElementoContableRepository.findByUuid.mockResolvedValue({ uuidElementoContable: 'e1' });
      prisma.cuentaContable.aggregate.mockResolvedValue({ _max: { codigoNumerico: 1 } });
      cuentaContableRepository.create.mockResolvedValue({ id: 2, ...payload });
      const result = await cuentaContableService.create(payload);
      expect(result).toEqual({ id: 2, ...payload });
    });
    it('debe lanzar error si falta nombre', async () => {
      await expect(cuentaContableService.create({})).rejects.toThrow('El nombre es obligatorio');
    });
    it('debe lanzar error si falta elemento contable', async () => {
      await expect(cuentaContableService.create({ nombre: 'Cuenta' })).rejects.toThrow('El elemento contable es obligatorio');
    });
    it('debe lanzar error si falta clasificación', async () => {
      await expect(cuentaContableService.create({ nombre: 'Cuenta', uuidElementoContable: 'e1' })).rejects.toThrow('La clasificación contable es obligatoria');
    });
    it('debe lanzar error si falta naturaleza', async () => {
      await expect(cuentaContableService.create({ nombre: 'Cuenta', uuidElementoContable: 'e1', uuidClasificacionContable: 'c1' })).rejects.toThrow('La naturaleza es obligatoria');
    });
    it('debe lanzar error si naturaleza no existe', async () => {
      diccNaturalezaCuentaRepository.findById.mockResolvedValue(null);
      await expect(cuentaContableService.create({ nombre: 'Cuenta', uuidElementoContable: 'e1', uuidClasificacionContable: 'c1', idNaturaleza: 1 })).rejects.toThrow('La naturaleza no existe');
    });
    it('debe manejar error de base de datos', async () => {
      diccNaturalezaCuentaRepository.findById.mockRejectedValue(new Error('DB error'));
      await expect(cuentaContableService.create({ nombre: 'Cuenta', uuidElementoContable: 'e1', uuidClasificacionContable: 'c1', idNaturaleza: 1 })).rejects.toThrow('DB error');
    });
  });

  describe('update', () => {
    it('debe actualizar una cuenta contable (happy path)', async () => {
      const id = 1;
      const actual = { id, nombre: 'Cuenta', disponible: true };
      cuentaContableRepository.findById.mockResolvedValue(actual);
      cuentaContableRepository.update.mockResolvedValue({ id, nombre: 'Nueva', disponible: false });
      const result = await cuentaContableService.update(id, { nombre: 'Nueva', disponible: false });
      expect(result).toEqual({ id, nombre: 'Nueva', disponible: false });
    });
    it('debe lanzar error si la cuenta no existe', async () => {
      cuentaContableRepository.findById.mockResolvedValue(null);
      await expect(cuentaContableService.update(1, {})).rejects.toThrow('Cuenta contable no encontrada');
    });
    it('debe lanzar error si nombre es vacío', async () => {
      cuentaContableRepository.findById.mockResolvedValue({ id: 1 });
      await expect(cuentaContableService.update(1, { nombre: '' })).rejects.toThrow('El nombre es obligatorio');
    });
    it('debe lanzar error si naturaleza no existe', async () => {
      cuentaContableRepository.findById.mockResolvedValue({ id: 1 });
      diccNaturalezaCuentaRepository.findById.mockResolvedValue(null);
      await expect(cuentaContableService.update(1, { idNaturaleza: 2 })).rejects.toThrow('La naturaleza contable no existe');
    });
    it('debe manejar error de base de datos', async () => {
      cuentaContableRepository.findById.mockResolvedValue({ id: 1 });
      cuentaContableRepository.update.mockRejectedValue(new Error('DB error'));
      await expect(cuentaContableService.update(1, { nombre: 'Nueva' })).rejects.toThrow('DB error');
    });
  });

  describe('patchEstado', () => {
    it('debe actualizar el estado disponible (happy path)', async () => {
      const id = 1;
      const actual = { id, uuidCuentaContable: 'uuid', disponible: true };
      cuentaContableRepository.findById.mockResolvedValue(actual);
      cuentaContableRepository.update.mockResolvedValue({ id, disponible: false });
      prisma.subCuentaContable.updateMany.mockResolvedValue({});
      const result = await cuentaContableService.patchEstado(id, { disponible: false });
      expect(result).toEqual({ id, disponible: false });
    });
    it('debe lanzar error si la cuenta no existe', async () => {
      cuentaContableRepository.findById.mockResolvedValue(null);
      await expect(cuentaContableService.patchEstado(1, { disponible: false })).rejects.toThrow('Cuenta contable no encontrada');
    });
    it('debe lanzar error si falta el campo disponible', async () => {
      cuentaContableRepository.findById.mockResolvedValue({ id: 1 });
      await expect(cuentaContableService.patchEstado(1, {})).rejects.toThrow('El estado disponible es obligatorio');
    });
    it('debe manejar error de base de datos', async () => {
      cuentaContableRepository.findById.mockResolvedValue({ id: 1 });
      cuentaContableRepository.update.mockRejectedValue(new Error('DB error'));
      await expect(cuentaContableService.patchEstado(1, { disponible: false })).rejects.toThrow('DB error');
    });
  });
});
