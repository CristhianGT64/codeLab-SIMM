import prisma from '../infra/prisma/prismaClient.js';

/**
 * Repositorio para interactuar con la base de datos de productos usando Prisma
 */
const productRepository = {
  /**
   * Obtiene todos los productos de la base de datos
   * @returns {Promise<Array>} Lista de productos
   */
  async getAllProducts() {
    return await prisma.product.findMany();
  },

  /**
   * Obtiene un producto por su ID
   * @param {number} id - ID del producto
   * @returns {Promise<Object|null>} Producto encontrado o null
   */
  async getProductById(id) {
    return await prisma.product.findUnique({
      where: { id },
    });
  },

  /**
   * Crea un nuevo producto
   * @param {Object} data - Datos del producto
   * @returns {Promise<Object>} Producto creado
   */
  async createProduct(data) {
    return await prisma.product.create({
      data,
    });
  },

  /**
   * Actualiza un producto existente
   * @param {number} id - ID del producto
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>} Producto actualizado
   */
  async updateProduct(id, data) {
    return await prisma.product.update({
      where: { id },
      data,
    });
  },

  /**
   * Elimina un producto
   * @param {number} id - ID del producto
   * @returns {Promise<Object>} Producto eliminado
   */
  async deleteProduct(id) {
    return await prisma.product.delete({
      where: { id },
    });
  },
};

export default productRepository;
