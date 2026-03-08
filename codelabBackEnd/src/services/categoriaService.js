import categoriaRepository from '../repositories/categoriaRepository.js';

const categoriaService = {
  list() {
    return categoriaRepository.list();
  },

  async getById(idParam) {
    const id = BigInt(idParam);
    const categoria = await categoriaRepository.findById(id);

    if (!categoria) {
      const err = new Error('Categoría no encontrada.');
      err.status = 404;
      throw err;
    }

    return categoria;
  },

  async create({ nombre, descripcion }) {
    if (!nombre) {
      const err = new Error('Campo requerido: nombre');
      err.status = 400;
      throw err;
    }

    const dup = await categoriaRepository.findByNombre(nombre);
    if (dup) {
      const err = new Error('La categoría ya existe.');
      err.status = 409;
      throw err;
    }

    return categoriaRepository.create({
      nombre,
      descripcion,
      disponible: true,
    });
  },

  async update(idParam, { nombre, descripcion }) {
    const id = BigInt(idParam);
    const current = await categoriaRepository.findById(id);

    if (!current) {
      const err = new Error('Categoría no encontrada.');
      err.status = 404;
      throw err;
    }

    const data = {};
    if (nombre !== undefined) data.nombre = nombre;
    if (descripcion !== undefined) data.descripcion = descripcion;

    return categoriaRepository.update(id, data);
  },

  async patch(idParam, { disponible }) {
    const id = BigInt(idParam);
    const current = await categoriaRepository.findById(id);

    if (!current) {
      const err = new Error('Categoría no encontrada.');
      err.status = 404;
      throw err;
    }

    if (disponible === undefined) {
      const err = new Error('Campo requerido: disponible');
      err.status = 400;
      throw err;
    }

    return categoriaRepository.update(id, { disponible: Boolean(disponible) });
  },

  async remove(idParam) {
    const id = BigInt(idParam);
    const current = await categoriaRepository.findById(id);

    if (!current) {
      const err = new Error('Categoría no encontrada.');
      err.status = 404;
      throw err;
    }

    await categoriaRepository.update(id, { disponible: false });
    return true;
  },
};

export default categoriaService;