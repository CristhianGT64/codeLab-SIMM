import impuestoRepository from '../repositories/impuestoRepository.js';

const impuestoService = {
  list() {
    return impuestoRepository.list();
  },
};

export default impuestoService;
