import reglaContableRepository from "../../../repositories/contabilidad/asiento/reglaContableRepository.js";

const reglaContableService = {

  async list() {
    return reglaContableRepository.findAll();
  },

  async getById(id) {
    return reglaContableRepository.findById(BigInt(id));
  },

  async create(data) {
    return reglaContableRepository.create(data);
  },

  async update(id, data) {
    return reglaContableRepository.update(BigInt(id), data);
  }

};

export default reglaContableService;