import clientRepository from "../repositories/clientRepository.js";

const createClient = async (data) => {

  if (data.identificacion) {
    const existing = await clientRepository.getByIdentificacion(data.identificacion);

    if (existing) {
      throw new Error("La identificación ya existe");
    }
  }

  return clientRepository.create(data);
};

const getClients = async (search) => {
  return clientRepository.getAll(search);
};

const updateClient = async (id, data) => {
  return clientRepository.update(id, data);
};

export default {
  createClient,
  getClients,
  updateClient
};