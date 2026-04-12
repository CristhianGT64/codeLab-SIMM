import categoriaService from '../categoriaService.js';
import categoriaRepository from '../../repositories/categoriaRepository.js';

jest.mock('../../repositories/categoriaRepository.js');

describe('categoriaService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('debe retornar la lista de categorías (happy path)', async () => {
      const categorias = [{ id: 1, nombre: 'Cat 1' }];
      categoriaRepository.list.mockResolvedValue(categorias);
      const result = await categoriaService.list();
      expect(result).toEqual(categorias);
    });
    it('debe manejar error de base de datos', async () => {
      categoriaRepository.list.mockRejectedValue(new Error('DB error'));
      await expect(categoriaService.list()).rejects.toThrow('DB error');
    });
  });

  describe('getById', () => {
    it('debe retornar la categoría por id (happy path)', async () => {
      const categoria = { id: 1, nombre: 'Cat 1' };
      categoriaRepository.findById.mockResolvedValue(categoria);
      const result = await categoriaService.getById(1);
      expect(result).toEqual(categoria);
    });
    it('debe lanzar error si no existe la categoría', async () => {
      categoriaRepository.findById.mockResolvedValue(null);
      await expect(categoriaService.getById(1)).rejects.toThrow('Categoría no encontrada');
    });
    it('debe manejar error de base de datos', async () => {
      categoriaRepository.findById.mockRejectedValue(new Error('DB error'));
      await expect(categoriaService.getById(1)).rejects.toThrow('DB error');
    });
  });

  describe('create', () => {
    it('debe crear una categoría (happy path)', async () => {
      const data = { nombre: 'Nueva', descripcion: 'desc' };
      categoriaRepository.findByNombre.mockResolvedValue(null);
      categoriaRepository.create.mockResolvedValue({ id: 2, ...data, disponible: true });
      const result = await categoriaService.create(data);
      expect(result).toEqual({ id: 2, ...data, disponible: true });
    });
    it('debe lanzar error si falta nombre', async () => {
      await expect(categoriaService.create({ descripcion: 'desc' })).rejects.toThrow('Campo requerido: nombre');
    });
    it('debe lanzar error si la categoría ya existe', async () => {
      categoriaRepository.findByNombre.mockResolvedValue({ id: 1, nombre: 'Nueva' });
      await expect(categoriaService.create({ nombre: 'Nueva' })).rejects.toThrow('La categoría ya existe');
    });
    it('debe manejar error de base de datos', async () => {
      categoriaRepository.findByNombre.mockRejectedValue(new Error('DB error'));
      await expect(categoriaService.create({ nombre: 'Nueva' })).rejects.toThrow('DB error');
    });
  });

  describe('update', () => {
    it('debe actualizar una categoría (happy path)', async () => {
      const id = 1;
      const data = { nombre: 'Actualizada', descripcion: 'desc' };
      categoriaRepository.findById.mockResolvedValue({ id });
      categoriaRepository.update.mockResolvedValue({ id, ...data });
      const result = await categoriaService.update(id, data);
      expect(result).toEqual({ id, ...data });
    });
    it('debe lanzar error si la categoría no existe', async () => {
      categoriaRepository.findById.mockResolvedValue(null);
      await expect(categoriaService.update(1, {})).rejects.toThrow('Categoría no encontrada');
    });
    it('debe manejar error de base de datos', async () => {
      categoriaRepository.findById.mockResolvedValue({ id: 1 });
      categoriaRepository.update.mockRejectedValue(new Error('DB error'));
      await expect(categoriaService.update(1, {})).rejects.toThrow('DB error');
    });
  });

  describe('patch', () => {
    it('debe actualizar disponible (happy path)', async () => {
      const id = 1;
      categoriaRepository.findById.mockResolvedValue({ id });
      categoriaRepository.update.mockResolvedValue({ id, disponible: false });
      const result = await categoriaService.patch(id, { disponible: false });
      expect(result).toEqual({ id, disponible: false });
    });
    it('debe lanzar error si la categoría no existe', async () => {
      categoriaRepository.findById.mockResolvedValue(null);
      await expect(categoriaService.patch(1, { disponible: false })).rejects.toThrow('Categoría no encontrada');
    });
    it('debe lanzar error si falta el campo disponible', async () => {
      categoriaRepository.findById.mockResolvedValue({ id: 1 });
      await expect(categoriaService.patch(1, {})).rejects.toThrow('Campo requerido: disponible');
    });
    it('debe manejar error de base de datos', async () => {
      categoriaRepository.findById.mockResolvedValue({ id: 1 });
      categoriaRepository.update.mockRejectedValue(new Error('DB error'));
      await expect(categoriaService.patch(1, { disponible: false })).rejects.toThrow('DB error');
    });
  });

  describe('remove', () => {
    it('debe eliminar (deshabilitar) una categoría (happy path)', async () => {
      const id = 1;
      categoriaRepository.findById.mockResolvedValue({ id });
      categoriaRepository.update.mockResolvedValue({ id, disponible: false });
      const result = await categoriaService.remove(id);
      expect(result).toBe(true);
    });
    it('debe lanzar error si la categoría no existe', async () => {
      categoriaRepository.findById.mockResolvedValue(null);
      await expect(categoriaService.remove(1)).rejects.toThrow('Categoría no encontrada');
    });
    it('debe manejar error de base de datos', async () => {
      categoriaRepository.findById.mockResolvedValue({ id: 1 });
      categoriaRepository.update.mockRejectedValue(new Error('DB error'));
      await expect(categoriaService.remove(1)).rejects.toThrow('DB error');
    });
  });
});
