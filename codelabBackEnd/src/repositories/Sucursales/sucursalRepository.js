import prisma from '../../infra/prisma/prismaClient.js';

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
   * @throws {Error} Si la sucursal no existe
   * Observación: El ID se espera como un parámetro de ruta. Si la sucursal no existe, se lanza un error 404.
  */
  async getSucursalById(id) {
    return await prisma.sucursal.findUnique({
      where: { id: Number(id) },
    });
  },

  /**
   * Busca una sucursal por ID (alias para validaciones)
   * @param {BigInt} id - ID de la sucursal
   * @returns {Promise<Object|null>} Sucursal encontrada o null
   * @throws {Error} Si la sucursal no existe
   * Observación: Se utiliza para validar la existencia de la sucursal antes de realizar operaciones.
   */
  findById(id) {
    return prisma.sucursal.findUnique({
      where: { id },
      select: { id: true },
    });
  },

  /**
   * Crea una nueva sucursal
   * @param {Object} data - Datos de la sucursal
   * @returns {Promise<Object>} Sucursal creada
   * @throws {Error} Si faltan campos obligatorios o si el nombre de la sucursal ya existe.
   * Observación: Se espera un cuerpo JSON con los datos de la sucursal. Si faltan campos obligatorios, se lanza un error 400.
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
   * @throws {Error} Si la sucursal no existe o si el nuevo nombre de la sucursal ya existe en otro registro.
   * Observación: El ID se espera como un parámetro de ruta. Si la sucursal no existe, se lanza un error 404.
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
   * @throws {Error} Si la sucursal no existe.
   * Observación: El ID se espera como un parámetro de ruta. Si la sucursal no existe, se lanza un error 404.
   */
  async updateSucursalStatus(id, activa) {
    return await prisma.sucursal.update({
      where: { id },
      data: { activa },
    });
  },
};

export default sucursalRepository;