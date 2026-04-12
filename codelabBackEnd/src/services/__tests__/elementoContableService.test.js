import elementoContableService from '../elementoContableService.js';
import elementoContableRepository from '../../repositories/elementoContableRepository.js';
import diccNaturalezaCuentaRepository from '../../repositories/diccNaturalezaCuentaRepository.js';
import prisma from '../../infra/prisma/prismaClient.js';

jest.mock('../../repositories/elementoContableRepository.js');
jest.mock('../../repositories/diccNaturalezaCuentaRepository.js');
jest.mock('../../infra/prisma/prismaClient.js', () => ({
  clasificacionElementoContable: { updateMany: jest.fn() },
  cuentaContable: { updateMany: jest.fn() },
  subCuentaContable: { updateMany: jest.fn() },
}));

// Mock explícito de prisma y sus métodos anidados usados en los tests
import actualPrisma from '../../infra/prisma/prismaClient.js';
beforeAll(() => {
  actualPrisma.clasificacionElementoContable = { updateMany: jest.fn() };
  actualPrisma.cuentaContable = { updateMany: jest.fn() };
  actualPrisma.subCuentaContable = { updateMany: jest.fn() };
});

describe('elementoContableService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('debe retornar la lista de elementos (happy path)', async () => {
      const elementos = [{ id: 1, nombre: 'Elemento 1' }];
      elementoContableRepository.list.mockResolvedValue(elementos);
      const result = await elementoContableService.list();
      expect(result).toEqual(elementos);
    });
    it('debe manejar error de base de datos', async () => {
      elementoContableRepository.list.mockRejectedValue(new Error('DB error'));
      await expect(elementoContableService.list()).rejects.toThrow('DB error');
    });
  });

  describe('getById', () => {
    it('debe retornar el elemento por id (happy path)', async () => {
      const elemento = { id: 1, nombre: 'Elemento 1' };
      elementoContableRepository.findById.mockResolvedValue(elemento);
      const result = await elementoContableService.getById(1);
      expect(result).toEqual(elemento);
    });
    it('debe lanzar error si no existe el elemento', async () => {
      elementoContableRepository.findById.mockResolvedValue(null);
      await expect(elementoContableService.getById(1)).rejects.toThrow('Elemento contable no encontrado');
    });
    it('debe manejar error de base de datos', async () => {
      elementoContableRepository.findById.mockRejectedValue(new Error('DB error'));
      await expect(elementoContableService.getById(1)).rejects.toThrow('DB error');
    });
  });

  describe('create', () => {
    it('debe crear un elemento (happy path)', async () => {
      const payload = { nombre: 'Elemento', idNaturaleza: 1 };
      diccNaturalezaCuentaRepository.findById.mockResolvedValue({ id: 1 });
      elementoContableRepository.list.mockResolvedValue([]);
      elementoContableRepository.create.mockResolvedValue({ id: 2, ...payload });
      const result = await elementoContableService.create(payload);
      expect(result).toEqual({ id: 2, ...payload });
    });
    it('debe lanzar error si falta nombre', async () => {
      await expect(elementoContableService.create({})).rejects.toThrow('El nombre es obligatorio');
    });
    it('debe lanzar error si falta naturaleza', async () => {
      await expect(elementoContableService.create({ nombre: 'Elemento' })).rejects.toThrow('La naturaleza es obligatoria');
    });
    it('debe lanzar error si naturaleza no existe', async () => {
      diccNaturalezaCuentaRepository.findById.mockResolvedValue(null);
      await expect(elementoContableService.create({ nombre: 'Elemento', idNaturaleza: 1 })).rejects.toThrow('La naturaleza contable no existe');
    });
    it('debe manejar error de base de datos', async () => {
      diccNaturalezaCuentaRepository.findById.mockRejectedValue(new Error('DB error'));
      await expect(elementoContableService.create({ nombre: 'Elemento', idNaturaleza: 1 })).rejects.toThrow('DB error');
    });
  });

  describe('update', () => {
    it('debe actualizar un elemento (happy path)', async () => {
      const id = 1;
      const actual = { id, nombre: 'Elemento', disponible: true };
      elementoContableRepository.findById.mockResolvedValue(actual);
      diccNaturalezaCuentaRepository.findById.mockResolvedValue({ id: 1 });
      elementoContableRepository.update.mockResolvedValue({ id, nombre: 'Nuevo', disponible: false });
      const result = await elementoContableService.update(id, { nombre: 'Nuevo', disponible: false, idNaturaleza: 1 });
      expect(result).toEqual({ id, nombre: 'Nuevo', disponible: false });
    });
    it('debe lanzar error si el elemento no existe', async () => {
      elementoContableRepository.findById.mockResolvedValue(null);
      await expect(elementoContableService.update(1, {})).rejects.toThrow('Elemento contable no encontrado');
    });
    it('debe lanzar error si nombre es vacío', async () => {
      elementoContableRepository.findById.mockResolvedValue({ id: 1 });
      await expect(elementoContableService.update(1, { nombre: '' })).rejects.toThrow('El nombre es obligatorio');
    });
    it('debe lanzar error si naturaleza no existe', async () => {
      elementoContableRepository.findById.mockResolvedValue({ id: 1 });
      diccNaturalezaCuentaRepository.findById.mockResolvedValue(null);
      await expect(elementoContableService.update(1, { idNaturaleza: 2 })).rejects.toThrow('La naturaleza contable no existe');
    });
    it('debe manejar error de base de datos', async () => {
      elementoContableRepository.findById.mockResolvedValue({ id: 1 });
      elementoContableRepository.update.mockRejectedValue(new Error('DB error'));
      await expect(elementoContableService.update(1, { nombre: 'Nuevo' })).rejects.toThrow('DB error');
    });
  });

  describe('patchEstado', () => {
    it('debe actualizar el estado disponible (happy path)', async () => {
      const id = 1;
      const actual = { id, uuidElementoContable: 'uuid', disponible: true };
      elementoContableRepository.findById.mockResolvedValue(actual);
      elementoContableRepository.update.mockResolvedValue({ id, disponible: false });
      prisma.clasificacionElementoContable.updateMany.mockResolvedValue({});
      prisma.cuentaContable.updateMany.mockResolvedValue({});
      prisma.subCuentaContable.updateMany.mockResolvedValue({});
      const result = await elementoContableService.patchEstado(id, { disponible: false });
      expect(result).toEqual({ id, disponible: false });
    });
    it('debe lanzar error si el elemento no existe', async () => {
      elementoContableRepository.findById.mockResolvedValue(null);
      await expect(elementoContableService.patchEstado(1, { disponible: false })).rejects.toThrow('Elemento contable no encontrado');
    });
    it('debe lanzar error si falta el campo disponible', async () => {
      elementoContableRepository.findById.mockResolvedValue({ id: 1 });
      await expect(elementoContableService.patchEstado(1, {})).rejects.toThrow('El estado disponible es obligatorio');
    });
    it('debe manejar error de base de datos', async () => {
      elementoContableRepository.findById.mockResolvedValue({ id: 1 });
      elementoContableRepository.update.mockRejectedValue(new Error('DB error'));
      await expect(elementoContableService.patchEstado(1, { disponible: false })).rejects.toThrow('DB error');
    });
  });
});
