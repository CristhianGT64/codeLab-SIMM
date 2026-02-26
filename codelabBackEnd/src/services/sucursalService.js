import sucursalRepository from '../repositories/sucursalRepository.js';

const sucursalService = {
  getAll() {
    return sucursalRepository.getAll();
  },

  async create({ nombre, direccion, telefono, gerente }) {
    if (!nombre) {
      const error = new Error('nombre es requerido');
      error.status = 400;
      throw error;
    }

    return sucursalRepository.create({
      nombre,
      direccion,
      telefono,
      gerente,
      activa: true,
      createdAt: new Date(),
    });
  },
};

export default sucursalService;