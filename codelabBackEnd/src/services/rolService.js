import rolRepository from '../repositories/rolRepository.js';

const rolService = {
  getAll() {
    return rolRepository.getAll();
  },

  async create({ nombre, descripcion }) {
    if (!nombre) {
      const error = new Error('nombre es requerido');
      error.status = 400;
      throw error;
    }

    return rolRepository.create({
      nombre,
      descripcion,
      disponible: true,
      createdAt: new Date(),
    });
  },
};

export default rolService;