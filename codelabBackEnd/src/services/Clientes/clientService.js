/**
 * Este archivo contiene la lógica de negocio, incluyendo validaciones y llamadas al repositorio.
 */

import clientRepository from '../../repositories/Clientes/clientRepository.js';

/**
 * Servicio para la lógica de negocio relacionada con clientes.
 */
const clientService = {
  /**
   * Obtiene todos los clientes
   * @param {string} search
   * @returns {Promise<Array>} Lista de clientes
   */
  async getAll(search = '') {
    return await clientRepository.getAllClients(search);
  },

  /**
   * Obtiene un cliente por su ID
   * @param {BigInt|number|string} id - ID del cliente
   * @returns {Promise<Object|null>} Cliente encontrado o null
   */
  async getById(id) {
    const cliente = await clientRepository.getClientById(BigInt(id));
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
    if (!data.tipoClienteId) {
      const error = new Error('El tipo de cliente es obligatorio');
      error.status = 400;
      throw error;
    }

    if (data.identificacion) {
      const existing = await clientRepository.getByIdentificacion(
        data.identificacion
      );
      if (existing) {
        const error = new Error('El cliente con esta identificación ya existe');
        error.status = 400;
        throw error;
      }
    }
    return await clientRepository.createClient(data);
  },

  /**
   * Actualiza un cliente existente
   * @param {BigInt|number|string} id - ID del cliente
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>} Cliente actualizado
   */
  async update(id, data) {
    await this.getById(id);

    if (data.tipoClienteId !== undefined && !data.tipoClienteId) {
      const error = new Error('El tipo de cliente es obligatorio');
      error.status = 400;
      throw error;
    }

    return await clientRepository.updateClient(BigInt(id), data);
  },
};

export default clientService;