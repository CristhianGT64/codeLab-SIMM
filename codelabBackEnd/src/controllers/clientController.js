/**
 * Este archivo maneja las solicitudes HTTP, llamando al servicio y respondiendo al cliente.
 */

import clientService from '../services/clientService.js';

/**
 * Controlador para manejar las solicitudes relacionadas con clientes.
 */
const clientController = {
  /**
   * Obtiene todos los clientes
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función next de Express
   */
  async getAllClients(req, res, next) {
    try {
      const clientes = await clientService.getAll();
      res.json({
        success: true,
        data: clientes,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Crea un nuevo cliente
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función next de Express
   */
  async createClient(req, res, next) {
    try {
      const cliente = await clientService.create(req.body);
      res.status(201).json({
        success: true,
        data: cliente,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Actualiza un cliente existente
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @param {Function} next - Función next de Express
   */
  async updateClient(req, res, next) {
    try {
      const { id } = req.params;
      // Remover cualquier campo 'id' accidental del body para evitar conflictos
      const { id: _ignored, ...data } = req.body;
      // Log para troubleshooting
      console.log('Actualizando cliente', id, data);
      const cliente = await clientService.update(
        Number.parseInt(id, 10),
        data
      );
      res.json({
        success: true,
        data: cliente,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default clientController;