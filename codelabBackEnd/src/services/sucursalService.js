import sucursalRepository from '../repositories/sucursalRepository.js';

/**
 * Servicio para la lógica de negocio relacionada con sucursales
 */
const sucursalService = {
  /**
   * Obtiene todas las sucursales
   * @returns {Promise<Array>} Lista de sucursales
   */
  async getAll() {
    return await sucursalRepository.getAllSucursales();
  },

  /**
   * Obtiene una sucursal por su ID
   * @param {number} id - ID de la sucursal
   * @returns {Promise<Object|null>} Sucursal encontrada o null
   */
  async getById(id) {
    const sucursal = await sucursalRepository.getSucursalById(id);
    if (!sucursal) {
      const error = new Error('Sucursal no encontrada');
      error.status = 404;
      throw error;
    }
    return sucursal;
  },

  /**
   * Crea una nueva sucursal
   * @param {Object} data - Datos de la sucursal
   * @returns {Promise<Object>} Sucursal creada
   */
  async create(data) {
    return await sucursalRepository.createSucursal(data);
  },

  /**
   * Actualiza una sucursal existente
   * @param {number} id - ID de la sucursal
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>} Sucursal actualizada
   */
  async update(id, data) {
    // Verificar que la sucursal existe
    await this.getById(id);
    return await sucursalRepository.updateSucursal(id, data);
  },

  /**
   * Cambia el estado de una sucursal (activar/desactivar)
   * @param {number} id - ID de la sucursal
   * @returns {Promise<Object>} Sucursal actualizada
   */
  async changeStatus(id) {
    // Verificar que la sucursal existe
    const sucursal = await this.getById(id);

    const nuevoEstado = !sucursal.activa;

    return await sucursalRepository.updateSucursalStatus(id, nuevoEstado);
  },
};

export default sucursalService;