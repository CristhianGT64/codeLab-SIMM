import {
  createClient as createClientImpl,
  getAllClients,
  getClient,
  updateClient as updateClientImpl,
} from './Impl/ClientsService';

export { getAllClients as listClients, getClient as getClientById, createClientImpl as createClient, updateClientImpl as updateClient };
