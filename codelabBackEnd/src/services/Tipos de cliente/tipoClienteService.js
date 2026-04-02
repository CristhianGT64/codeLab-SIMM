import tipoClienteRepository from '../../repositories/Tipos de cliente/tipoClienteRepository.js';

/**
 * Servicio para la lógica de negocio relacionada con tipos de cliente.
 */

const tipoClienteService = {
  /**
   * Obtiene todos los tipos de cliente.
   * Permite un parámetro de búsqueda opcional para filtrar por nombre o descripción (case-insensitive).
   * @param {string} search - Término de búsqueda para filtrar tipos de cliente.
   * @return {Promise<Array>} Lista de tipos de cliente que coinciden con el criterio de búsqueda.
   * Observación: Si el parámetro de búsqueda está vacío, se retornan todos los tipos de cliente.
   */
  async getAll(search = '') {
    return await tipoClienteRepository.getAlltiposdecliente(search);
  },

  /**
   * Obtiene un tipo de cliente por ID.
   * @param {string|number} id - ID del tipo de cliente.
   * @return {Promise<Object>} Tipo de cliente encontrado.
   * @throws {Error} Si el tipo de cliente no existe.
   * Observación: El ID se espera como un parámetro de ruta. Si el tipo de cliente no existe, se lanza un error 404.
   */
  async getById(id) {
    const tipo = await tipoClienteRepository.getByIdtiposdecliente(id);
    if (!tipo) {
      const error = new Error('Tipo de cliente no encontrado');
      error.status = 404;
      throw error;
    }
    return tipo;
  },

  /**
   * Crea un nuevo tipo de cliente.
   * @param {Object} data - Datos del tipo de cliente a crear.
   * @return {Promise<Object>} Tipo de cliente creado.
   * @throws {Error} Si el nombre del tipo de cliente es obligatorio o ya existe.
   * Observación: El nombre del tipo de cliente se espera en el cuerpo de la solicitud. Si el nombre ya existe, se lanza un error 400.
   */
  async create(data) {
    if (!data.nombre || !data.nombre.trim()) {
      const error = new Error('El nombre del tipo de cliente es obligatorio');
      error.status = 400;
      throw error;
    }

    const existing = await tipoClienteRepository.getByNombretiposdecliente(data.nombre.trim());
    if (existing) {
      const error = new Error('Ya existe un tipo de cliente con ese nombre');
      error.status = 400;
      throw error;
    }

    return await tipoClienteRepository.create({
      ...data,
      nombre: data.nombre.trim(),
    });
  },

  /**
   * Actualiza un tipo de cliente existente.
   * @param {string|number} id - ID del tipo de cliente a actualizar.
   * @param {Object} data - Datos del tipo de cliente a actualizar.
   * @return {Promise<Object>} Tipo de cliente actualizado.
   * @throws {Error} Si el tipo de cliente no existe o si el nuevo nombre ya existe en otro registro.
   * Observación: El ID se espera como un parámetro de ruta. Si el tipo de cliente no existe, se lanza un error 404.
   */
  async update(id, data) {
    await this.getById(id);

    if (data.nombre !== undefined) {
      if (!data.nombre.trim()) {
        const error = new Error('El nombre del tipo de cliente no puede estar vacío');
        error.status = 400;
        throw error;
      }

      const existing = await tipoClienteRepository.getByNombretiposdecliente(data.nombre.trim());
      if (existing && existing.id !== BigInt(id)) {
        const error = new Error('Ya existe otro tipo de cliente con ese nombre');
        error.status = 400;
        throw error;
      }

      data.nombre = data.nombre.trim();
    }

    return await tipoClienteRepository.update(id, data);
  },

  /**
   * Cambia el estado (activo/inactivo) de un tipo de cliente.
   * @param {string|number} id - ID del tipo de cliente.
   * @param {boolean} disponible - Nuevo estado del tipo de cliente.
   * @return {Promise<Object>} Tipo de cliente actualizado.
   * @throws {Error} Si el tipo de cliente no existe o si tiene clientes asociados al intentar desactivarlo.
   * Observación: El ID se espera como un parámetro de ruta. Si el tipo de cliente no existe, se lanza un error 404.
   */
  async cambiartipodeclienteEstado(id, disponible) {
    const tipo = await this.getById(id);

    if (!disponible) {
      const count = await tipoClienteRepository.countClientesByTipoId(id);
      if (count > 0) {
        const error = new Error(
          `No se puede desactivar este tipo de cliente porque tiene ${count} cliente(s) asociado(s)`
        );
        error.status = 400;
        throw error;
      }
    }

    return await tipoClienteRepository.cambiarEstado(id, disponible);
  },
};

export default tipoClienteService;
