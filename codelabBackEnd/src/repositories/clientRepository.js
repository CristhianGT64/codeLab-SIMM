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
   * @param {string} search - Texto de búsqueda en nombreCompleto o identificacion
   * @returns {Promise<Array>} Lista de clientes
   */
  async getAllClients(search = '') {
    const where = search
      ? {
          OR: [
            { nombreCompleto: { contains: search, mode: 'insensitive' } },
            { identificacion: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    return await prisma.cliente.findMany({
      where,
      include: {
        tipoCliente: true,
      },
    });
  },

  /**
   * Obtiene un cliente por su ID
   * @param {BigInt|number|string} id - ID del cliente
   * @returns {Promise<Object|null>} Cliente encontrado o null
   */
  async getClientById(id) {
    return await prisma.cliente.findUnique({
      where: { id: BigInt(id) },
      include: {
        facturas: true,
        tipoCliente: true,
      },
    });
  },

  /**
   * Busca un cliente por su DNI/identificación (único)
   * @param {string} identificacion
   * @returns {Promise<Object|null>}
   */
  async getByIdentificacion(identificacion) {
    if (!identificacion) return null;
    return await prisma.cliente.findUnique({
      where: { identificacion },
    });
  },

  /**
   * Busca un cliente por ID (alias para validaciones)
   * @param {BigInt|number|string} id - ID del cliente
   * @returns {Promise<Object|null>} Cliente encontrado o null
   */
  findById(id) {
    return prisma.cliente.findUnique({
      where: { id: BigInt(id) },
      select: { id: true },
    });
  },

  /**
   * Crea un nuevo cliente
   * @param {Object} data - Datos del cliente
   * @returns {Promise<Object>} Cliente creado
   */
  async createClient(data) {
    let tipoClienteId;
    if (data.tipoClienteId !== undefined && data.tipoClienteId !== null) {
      tipoClienteId = BigInt(data.tipoClienteId);
      const existing = await prisma.tipoCliente.findUnique({
        where: { id: tipoClienteId },
      });
      if (!existing) {
        tipoClienteId = undefined;
      }
    }

    if (!tipoClienteId && data.tipoCliente) {
      const nombre = String(data.tipoCliente).trim();
      const found = await prisma.tipoCliente.findFirst({
        where: { nombre: { equals: nombre, mode: 'insensitive' } },
      });
      if (found) {
        tipoClienteId = found.id;
      } else {
        const created = await prisma.tipoCliente.create({
          data: { nombre },
        });
        tipoClienteId = created.id;
      }
    }

    const payload = {
      ...data,
      tipoClienteId: tipoClienteId !== undefined ? tipoClienteId : undefined,
    };
    delete payload.tipoCliente;
    return await prisma.cliente.create({
      data: payload,
    });
  },

  /**
   * Actualiza un cliente existente
   * @param {BigInt|number|string} id - ID del cliente
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>} Cliente actualizado
   */
  async updateClient(id, data) {
    let tipoClienteId;
    if (data.tipoClienteId !== undefined && data.tipoClienteId !== null) {
      tipoClienteId = BigInt(data.tipoClienteId);
      const existing = await prisma.tipoCliente.findUnique({
        where: { id: tipoClienteId },
      });
      if (!existing) {
        tipoClienteId = undefined;
      }
    }

    if (!tipoClienteId && data.tipoCliente) {
      const nombre = String(data.tipoCliente).trim();
      const found = await prisma.tipoCliente.findFirst({
        where: { nombre: { equals: nombre, mode: 'insensitive' } },
      });
      if (found) {
        tipoClienteId = found.id;
      } else {
        const created = await prisma.tipoCliente.create({
          data: { nombre },
        });
        tipoClienteId = created.id;
      }
    }

    const payload = {
      ...data,
      tipoClienteId: tipoClienteId !== undefined ? tipoClienteId : data.tipoClienteId,
    };
    delete payload.tipoCliente;
    return await prisma.cliente.update({
      where: { id: BigInt(id) },
      data: payload,
    });
  },
};

export default clientRepository;