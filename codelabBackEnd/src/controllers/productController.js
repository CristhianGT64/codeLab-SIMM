import productService from '../services/productService.js';

/**
 * Controlador para manejar las solicitudes relacionadas con productos
 */
const productController = {
  /**
   * Obtiene todos los productos
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función next de Express
   */
  async getAllProducts(req, res, next) {
    try {
      const products = await productService.getAll();
      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtiene un producto por su ID
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función next de Express
   */
  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getById(Number.parseInt(id, 10));
      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Crea un nuevo producto
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función next de Express
   */
  async createProduct(req, res, next) {
    try {
      const product = await productService.create(req.body);
      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Actualiza un producto existente
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función next de Express
   */
  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.update(Number.parseInt(id, 10), req.body);
      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Activa un producto (solo cambia su estado)
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función next de Express
   */
  async activateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.activate(Number.parseInt(id, 10));
      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Inactiva un producto (solo cambia su estado)
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función next de Express
   */
  async deactivateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.deactivate(Number.parseInt(id, 10));
      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Elimina un producto
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función next de Express
   */
  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      await productService.delete(Number.parseInt(id, 10));
      res.json({
        success: true,
        message: 'Producto eliminado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },
};

export default productController;
