import productRepository from '../repositories/productRepository.js';

/**
 * Servicio para la lógica de negocio relacionada con productos
 */
const productService = {
  /**
   * Obtiene todos los productos
   * @returns {Promise<Array>} Lista de productos
   */
  async getAll() {
    return await productRepository.getAllProducts();
  },

  /**
   * Obtiene un producto por su ID
   * @param {number} id - ID del producto
   * @returns {Promise<Object|null>} Producto encontrado o null
   */
  async getById(id) {
    const product = await productRepository.getProductById(id);
    if (!product) {
      const error = new Error('Producto no encontrado');
      error.status = 404;
      throw error;
    }
    return product;
  },

  /**
   * Crea un nuevo producto
   * @param {Object} data - Datos del producto
   * @returns {Promise<Object>} Producto creado
   */
  async create(data) {
    return await productRepository.createProduct(data);
  },

  /**
   * Actualiza un producto existente
   * @param {number} id - ID del producto
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>} Producto actualizado
   */
  async update(id, data) {
    // Verificar que el producto existe
    await this.getById(id);
    return await productRepository.updateProduct(id, data);
  },

  /**
   * Cambia el estado de un producto a activo
   * @param {number} id - ID del producto
   * @returns {Promise<Object>} Producto actualizado
   */
  async activate(id) {
    await this.getById(id);
    return await productRepository.updateProductStatus(id, 'activo');
  },

  /**
   * Cambia el estado de un producto a inactivo
   * @param {number} id - ID del producto
   * @returns {Promise<Object>} Producto actualizado
   */
  async deactivate(id) {
    await this.getById(id);
    return await productRepository.updateProductStatus(id, 'inactivo');
  },

  /**
   * Elimina un producto
   * @param {number} id - ID del producto
   * @returns {Promise<Object>} Producto eliminado
   */
  async delete(id) {
    // Verificar que el producto existe
    await this.getById(id);
    return await productRepository.deleteProduct(id);
  },
};

export default productService;
