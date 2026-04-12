import diccNaturalezaCuentaService from '../diccNaturalezaCuentaService.js';
import diccNaturalezaCuentaRepository from '../../repositories/diccNaturalezaCuentaRepository.js';

jest.mock('../../repositories/diccNaturalezaCuentaRepository.js');

describe('diccNaturalezaCuentaService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('debe retornar la lista de naturalezas (happy path)', async () => {
      const naturalezas = [{ id: 1, nombre: 'NAT' }];
      diccNaturalezaCuentaRepository.list.mockResolvedValue(naturalezas);
      const result = await diccNaturalezaCuentaService.list();
      expect(result).toEqual(naturalezas);
    });
    it('debe manejar error de base de datos', async () => {
      diccNaturalezaCuentaRepository.list.mockRejectedValue(new Error('DB error'));
      await expect(diccNaturalezaCuentaService.list()).rejects.toThrow('DB error');
    });
  });

  describe('getById', () => {
    it('debe retornar la naturaleza por id (happy path)', async () => {
      const naturaleza = { id: 1, nombre: 'NAT' };
      diccNaturalezaCuentaRepository.findById.mockResolvedValue(naturaleza);
      const result = await diccNaturalezaCuentaService.getById(1);
      expect(result).toEqual(naturaleza);
    });
    it('debe lanzar error si no existe la naturaleza', async () => {
      diccNaturalezaCuentaRepository.findById.mockResolvedValue(null);
      await expect(diccNaturalezaCuentaService.getById(1)).rejects.toThrow('Naturaleza contable no encontrada');
    });
    it('debe manejar error de base de datos', async () => {
      diccNaturalezaCuentaRepository.findById.mockRejectedValue(new Error('DB error'));
      await expect(diccNaturalezaCuentaService.getById(1)).rejects.toThrow('DB error');
    });
  });

  describe('create', () => {
    it('debe crear una naturaleza (happy path)', async () => {
      const payload = { nombre: 'NAT' };
      diccNaturalezaCuentaRepository.create.mockResolvedValue({ id: 2, ...payload });
      const result = await diccNaturalezaCuentaService.create(payload);
      expect(result).toEqual({ id: 2, ...payload });
    });
    it('debe lanzar error si falta nombre', async () => {
      await expect(diccNaturalezaCuentaService.create({})).rejects.toThrow('El nombre es obligatorio');
    });
    it('debe manejar error de base de datos', async () => {
      diccNaturalezaCuentaRepository.create.mockRejectedValue(new Error('DB error'));
      await expect(diccNaturalezaCuentaService.create({ nombre: 'NAT' })).rejects.toThrow('DB error');
    });
  });

  describe('update', () => {
    it('debe actualizar una naturaleza (happy path)', async () => {
      const id = 1;
      const actual = { id, nombre: 'NAT', disponible: true };
      diccNaturalezaCuentaRepository.findById.mockResolvedValue(actual);
      diccNaturalezaCuentaRepository.update.mockResolvedValue({ id, nombre: 'NUEVA', disponible: false });
      diccNaturalezaCuentaRepository.findByNombre.mockResolvedValue(null);
      const result = await diccNaturalezaCuentaService.update(id, { nombre: 'NUEVA', disponible: false });
      expect(result).toEqual({ id, nombre: 'NUEVA', disponible: false });
    });
    it('debe lanzar error si la naturaleza no existe', async () => {
      diccNaturalezaCuentaRepository.findById.mockResolvedValue(null);
      await expect(diccNaturalezaCuentaService.update(1, {})).rejects.toThrow('Naturaleza contable no encontrada');
    });
    it('debe lanzar error si nombre es vacío', async () => {
      diccNaturalezaCuentaRepository.findById.mockResolvedValue({ id: 1 });
      await expect(diccNaturalezaCuentaService.update(1, { nombre: '' })).rejects.toThrow('El nombre es obligatorio');
    });
    it('debe lanzar error si nombre ya existe', async () => {
      diccNaturalezaCuentaRepository.findById.mockResolvedValue({ id: 1 });
      diccNaturalezaCuentaRepository.findByNombre.mockResolvedValue({ id: 2 });
      await expect(diccNaturalezaCuentaService.update(1, { nombre: 'NAT' })).rejects.toThrow('Ya existe una naturaleza contable con ese nombre');
    });
    it('debe manejar error de base de datos', async () => {
      diccNaturalezaCuentaRepository.findById.mockResolvedValue({ id: 1 });
      diccNaturalezaCuentaRepository.findByNombre = jest.fn().mockResolvedValue(null); // Asegura que no existe duplicado
      diccNaturalezaCuentaRepository.update.mockRejectedValue(new Error('DB error'));
      await expect(diccNaturalezaCuentaService.update(1, { nombre: 'NUEVA' })).rejects.toThrow('DB error');
    });
  });

  describe('patchEstado', () => {
    it('debe actualizar el estado disponible (happy path)', async () => {
      const id = 1;
      const actual = { id, disponible: true };
      diccNaturalezaCuentaRepository.findById.mockResolvedValue(actual);
      diccNaturalezaCuentaRepository.update.mockResolvedValue({ id, disponible: false });
      const result = await diccNaturalezaCuentaService.patchEstado(id, { disponible: false });
      expect(result).toEqual({ id, disponible: false });
    });
    it('debe lanzar error si la naturaleza no existe', async () => {
      diccNaturalezaCuentaRepository.findById.mockResolvedValue(null);
      await expect(diccNaturalezaCuentaService.patchEstado(1, { disponible: false })).rejects.toThrow('Naturaleza contable no encontrada');
    });
    it('debe lanzar error si falta el campo disponible', async () => {
      diccNaturalezaCuentaRepository.findById.mockResolvedValue({ id: 1 });
      await expect(diccNaturalezaCuentaService.patchEstado(1, {})).rejects.toThrow('El estado disponible es obligatorio');
    });
    it('debe manejar error de base de datos', async () => {
      diccNaturalezaCuentaRepository.findById.mockResolvedValue({ id: 1 });
      diccNaturalezaCuentaRepository.update.mockRejectedValue(new Error('DB error'));
      await expect(diccNaturalezaCuentaService.patchEstado(1, { disponible: false })).rejects.toThrow('DB error');
    });
  });
});
