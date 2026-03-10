import invoiceTypeRepository from '../repositories/invoiceTypeRepository.js';

const invoiceTypeService = {

  async create(data) {

    if (!data.nombre) {
      throw new Error("Invoice type name is required");
    }

    return invoiceTypeRepository.create(data);
  },

  async getAll() {
    return invoiceTypeRepository.getAll();
  },

  async getById(id) {

    const invoiceType = await invoiceTypeRepository.getById(id);

    if (!invoiceType) {
      throw new Error("Invoice type not found");
    }

    return invoiceType;
  },

  async update(id, data) {
    return invoiceTypeRepository.update(id, data);
  },

  async updateStatus(id, disponible) {
    return invoiceTypeRepository.updateStatus(id, disponible);
  }

};

export default invoiceTypeService;