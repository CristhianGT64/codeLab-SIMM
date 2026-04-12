import clasificacionElementoContableService from '../clasificacionElementoContableService.js';
import clasificacionElementoContableRepository from '../../repositories/clasificacionElementoContableRepository.js';
import elementoContableRepository from '../../repositories/elementoContableRepository.js';
import prisma from '../../infra/prisma/prismaClient.js';

jest.mock('../../repositories/clasificacionElementoContableRepository.js');
jest.mock('../../repositories/elementoContableRepository.js');
jest.mock('../../infra/prisma/prismaClient.js', () => ({
  cuentaContable: { updateMany: jest.fn() },
  subCuentaContable: { updateMany: jest.fn() },
}));

// Mock explícito de prisma y sus métodos anidados usados en los tests
import actualPrisma from '../../infra/prisma/prismaClient.js';
beforeAll(() => {
  actualPrisma.cuentaContable = { updateMany: jest.fn() };
  actualPrisma.subCuentaContable = { updateMany: jest.fn() };
});

describe('clasificacionElementoContableService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('debe retornar la lista de clasificaciones (happy path)', async () => {
      const clasificaciones = [{ id: 1, nombre: 'Clasificación 1' }];
      clasificacionElementoContableRepository.list.mockResolvedValue(clasificaciones);
      const result = await clasificacionElementoContableService.list();
      expect(result).toEqual(clasificaciones);
    });
    it('debe manejar error de base de datos', async () => {
      clasificacionElementoContableRepository.list.mockRejectedValue(new Error('DB error'));
      await expect(clasificacionElementoContableService.list()).rejects.toThrow('DB error');
    });
  });

  describe('getById', () => {
    it('debe retornar la clasificación por id (happy path)', async () => {
      const clasificacion = { id: 1, nombre: 'Clasificación 1' };
      clasificacionElementoContableRepository.findById.mockResolvedValue(clasificacion);
      const result = await clasificacionElementoContableService.getById(1);
      expect(result).toEqual(clasificacion);
    });
    it('debe lanzar error si no existe la clasificación', async () => {
      clasificacionElementoContableRepository.findById.mockResolvedValue(null);
      await expect(clasificacionElementoContableService.getById(1)).rejects.toThrow('Clasificación contable no encontrada');
    });
    it('debe manejar error de base de datos', async () => {
      clasificacionElementoContableRepository.findById.mockRejectedValue(new Error('DB error'));
      await expect(clasificacionElementoContableService.getById(1)).rejects.toThrow('DB error');
    });
  });

  describe('create', () => {
    it('debe crear una clasificación (happy path)', async () => {
      const payload = { nombre: 'Clasificación', uuidElementoContable: 'e1' };
      elementoContableRepository.findByUuid.mockResolvedValue({});
      clasificacionElementoContableRepository.list.mockResolvedValue([]);
      clasificacionElementoContableRepository.create.mockResolvedValue({ id: 2, ...payload });
      const result = await clasificacionElementoContableService.create(payload);
      expect(result).toEqual({ id: 2, ...payload });
    });
    it('debe lanzar error si falta nombre', async () => {
      await expect(clasificacionElementoContableService.create({})).rejects.toThrow('El nombre es obligatorio');
    });
    it('debe lanzar error si falta elemento contable', async () => {
      await expect(clasificacionElementoContableService.create({ nombre: 'Clasificación' })).rejects.toThrow('El elemento contable es obligatorio');
    });
    it('debe lanzar error si elemento contable no existe', async () => {
      elementoContableRepository.findByUuid.mockResolvedValue(null);
      await expect(clasificacionElementoContableService.create({ nombre: 'Clasificación', uuidElementoContable: 'e1' })).rejects.toThrow('El elemento contable no existe');
    });
    it('debe manejar error de base de datos', async () => {
      elementoContableRepository.findByUuid.mockRejectedValue(new Error('DB error'));
      await expect(clasificacionElementoContableService.create({ nombre: 'Clasificación', uuidElementoContable: 'e1' })).rejects.toThrow('DB error');
    });
  });

  describe('update', () => {
    it('debe actualizar una clasificación (happy path)', async () => {
      const id = 1;
      const actual = { id, nombre: 'Clasificación', disponible: true };
      clasificacionElementoContableRepository.findById.mockResolvedValue(actual);
      clasificacionElementoContableRepository.update.mockResolvedValue({ id, nombre: 'Nueva', disponible: false });
      const result = await clasificacionElementoContableService.update(id, { nombre: 'Nueva', disponible: false });
      expect(result).toEqual({ id, nombre: 'Nueva', disponible: false });
    });
    it('debe lanzar error si la clasificación no existe', async () => {
      clasificacionElementoContableRepository.findById.mockResolvedValue(null);
      await expect(clasificacionElementoContableService.update(1, {})).rejects.toThrow('Clasificación contable no encontrada');
    });
    it('debe lanzar error si nombre es vacío', async () => {
      clasificacionElementoContableRepository.findById.mockResolvedValue({ id: 1 });
      await expect(clasificacionElementoContableService.update(1, { nombre: '' })).rejects.toThrow('El nombre es obligatorio');
    });
    it('debe manejar error de base de datos', async () => {
      clasificacionElementoContableRepository.findById.mockResolvedValue({ id: 1 });
      clasificacionElementoContableRepository.update.mockRejectedValue(new Error('DB error'));
      await expect(clasificacionElementoContableService.update(1, { nombre: 'Nueva' })).rejects.toThrow('DB error');
    });
  });

  describe('patchEstado', () => {
    it('debe actualizar el estado disponible (happy path)', async () => {
      const id = 1;
      const actual = { id, uuidClasificacionContable: 'uuid', disponible: true };
      clasificacionElementoContableRepository.findById.mockResolvedValue(actual);
      clasificacionElementoContableRepository.update.mockResolvedValue({ id, disponible: false });
      prisma.cuentaContable.updateMany.mockResolvedValue({});
      prisma.subCuentaContable.updateMany.mockResolvedValue({});
      const result = await clasificacionElementoContableService.patchEstado(id, { disponible: false });
      expect(result).toEqual({ id, disponible: false });
    });
    it('debe lanzar error si la clasificación no existe', async () => {
      clasificacionElementoContableRepository.findById.mockResolvedValue(null);
      await expect(clasificacionElementoContableService.patchEstado(1, { disponible: false })).rejects.toThrow('Clasificación contable no encontrada');
    });
    it('debe lanzar error si falta el campo disponible', async () => {
      clasificacionElementoContableRepository.findById.mockResolvedValue({ id: 1 });
      await expect(clasificacionElementoContableService.patchEstado(1, {})).rejects.toThrow('El estado disponible es obligatorio');
    });
    it('debe manejar error de base de datos', async () => {
      clasificacionElementoContableRepository.findById.mockResolvedValue({ id: 1 });
      clasificacionElementoContableRepository.update.mockRejectedValue(new Error('DB error'));
      await expect(clasificacionElementoContableService.patchEstado(1, { disponible: false })).rejects.toThrow('DB error');
    });
  });
});
