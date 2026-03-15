
/**
 * Este archivo maneja la interacción directa con la base de datos usando Prisma.
 */

import prisma from '../infra/prisma/prismaClient.js';

/**
 * Repositorio para interactuar con la base de datos de clientes usando Prisma
 */
const clientRepository = {
  /**
   * Obtiene todos los clientes de la base de datos
   * @returns {Promise<Array>} Lista de clientes
   */
  async getAllClients() {
    return await prisma.cliente.findMany();
  },

  /**
   * Obtiene un cliente por su ID
   * @param {number} id - ID del cliente
   * @returns {Promise<Object|null>} Cliente encontrado o null
   */
  async getClientById(id) {
    return await prisma.cliente.findUnique({
      where: { id: Number(id) },
    });
  },

  /**
   * Busca un cliente por ID (alias para validaciones)
   * @param {BigInt} id - ID del cliente
   * @returns {Promise<Object|null>} Cliente encontrado o null
   */
  findById(id) {
    return prisma.cliente.findUnique({
      where: { id },
      select: { id: true },
    });
  },

  /**
   * Crea un nuevo cliente
   * @param {Object} data - Datos del cliente
   * @returns {Promise<Object>} Cliente creado
   */
  async createClient(data) {
    return await prisma.cliente.create({
      data,
    });
  },

  /**
   * Actualiza un cliente existente
   * @param {number} id - ID del cliente
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>} Cliente actualizado
   */
  async updateClient(id, data) {
    return await prisma.cliente.update({
      where: { id },
      data,
    });
  },
};

export default clientRepository;