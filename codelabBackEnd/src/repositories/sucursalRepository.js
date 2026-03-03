import prisma from '../infra/prisma/prismaClient.js';

/**
 * Repositorio para interactuar con la base de datos de sucursales usando Prisma
 */
const sucursalRepository = {
  /**
   * Obtiene todas las sucursales de la base de datos
   * @returns {Promise<Array>} Lista de sucursales
   */
  async getAllSucursales() {
    return await prisma.sucursal.findMany();
  },

  /**
   * Obtiene una sucursal por su ID
   * @param {number} id - ID de la sucursal
   * @returns {Promise<Object|null>} Sucursal encontrada o null
   */
  async getSucursalById(id) {
    return await prisma.sucursal.findUnique({
      where: { id },
    });
  },

  /**
   * Crea una nueva sucursal
   * @param {Object} data - Datos de la sucursal
   * @returns {Promise<Object>} Sucursal creada
   */
  async createSucursal(data) {
    return await prisma.sucursal.create({
      data,
    });
  },

  /**
   * Actualiza una sucursal existente
   * @param {number} id - ID de la sucursal
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>} Sucursal actualizada
   */
  async updateSucursal(id, data) {
    return await prisma.sucursal.update({
      where: { id },
      data,
    });
  },

  /**
   * Cambia el estado de una sucursal (activo/inactivo)
   * @param {number} id - ID de la sucursal
   * @param {boolean} activo - Nuevo estado
   * @returns {Promise<Object>} Sucursal actualizada
   */
  async updateSucursalStatus(id, activa) {
    return await prisma.sucursal.update({
      where: { id },
      data: { activa },
    });
  },
};

export default sucursalRepository;