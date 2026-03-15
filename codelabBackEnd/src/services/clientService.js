/**
 * Este archivo contiene la lógica de negocio, incluyendo validaciones y llamadas al repositorio.
 */

import clientRepository from '../repositories/clientRepository.js';

/**
 * Servicio para la lógica de negocio relacionada con clientes.
 */
const clientService = {
  /**
   * Obtiene todos los clientes
   * @returns {Promise<Array>} Lista de clientes
   */
  async getAll() {
    return await clientRepository.getAllClients();
  },

  /**
   * Obtiene un cliente por su ID
   * @param {number} id - ID del cliente
   * @returns {Promise<Object|null>} Cliente encontrado o null
   */
  async getById(id) {
    const cliente = await clientRepository.getClientById(id);
    if (!cliente) {
      const error = new Error('Cliente no encontrado');
      error.status = 404;
      throw error;
    }
    return cliente;
  },

  /**
   * Crea un nuevo cliente
   * @param {Object} data - Datos del cliente
   * @returns {Promise<Object>} Cliente creado
   */
  async create(data) {
    return await clientRepository.createClient(data);
  },

  /**
   * Actualiza un cliente existente
   * @param {number} id - ID del cliente
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>} Cliente actualizado
   */
  
  async update(id, data) {
    // Verificar que el cliente existe
    await this.getById(id);
    return await clientRepository.updateClient(id, data);
  },
};

export default clientService;