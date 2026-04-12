/**
 * Este archivo maneja las solicitudes HTTP, llamando al servicio y respondiendo al cliente.
 */

import clientService from '../../services/Clientes/clientService.js';

/**
 * Controlador para manejar las solicitudes relacionadas con clientes.
 */
const clientController = {
  /**
   * Obtiene todos los clientes
   */
  async getAllClients(req, res, next) {
    try {
      const search = req.query.search || '';
      const clientes = await clientService.getAll(search);
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
   */
  async getClientById(req, res, next) {
    try {
      const { id } = req.params;
      const cliente = await clientService.getById(id);
      res.json({
        success: true,
        data: cliente,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateClient(req, res, next) {
    try {
      const { id } = req.params;
      const { id: _ignored, ...data } = req.body;
      console.log('Actualizando cliente', id, data);
      const cliente = await clientService.update(BigInt(id), data);
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