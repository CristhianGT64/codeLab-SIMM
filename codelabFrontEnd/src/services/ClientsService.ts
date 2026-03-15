// Servicios para clientes: listar, crear, editar, obtener detalle
import axios from 'axios';
import { Client, ClientDetail, CreateClientPayload, UpdateClientPayload } from '../interfaces/Clients/ClientInterface';

const API_URL = '/api/clientes';

export const listClients = async (): Promise<Client[]> => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const getClientById = async (id: number): Promise<ClientDetail> => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

export const createClient = async (payload: CreateClientPayload): Promise<Client> => {
  const { data } = await axios.post(API_URL, payload);
  return data;
};

export const updateClient = async (id: number, payload: UpdateClientPayload): Promise<Client> => {
  const { data } = await axios.put(`${API_URL}/${id}`, payload);
  return data;
};
