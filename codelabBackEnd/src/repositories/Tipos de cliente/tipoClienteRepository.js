import prisma from '../../infra/prisma/prismaClient.js';

/**
 * Repositorio para interactuar con la base de datos de tipos de cliente usando Prisma.
 */

const tipoClienteRepository = {
  /**
   * Obtiene todos los tipos de cliente, con filtro de búsqueda opcional.
   * @param {string} search - Término de búsqueda para filtrar por nombre o descripción (case-insensitive).
   * @return {Promise<Array>} Lista de tipos de cliente que coinciden con el criterio de búsqueda.
   * Observación: Si el parámetro de búsqueda está vacío, se retornan todos los tipos de cliente.   
   */
  async getAlltiposdecliente(search = '') {
    const where = search
      ? {
          OR: [
            { nombre: { contains: search, mode: 'insensitive' } },
            { descripcion: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    return await prisma.tipoCliente.findMany({
      where,
      include: {
        _count: { select: { clientes: true } },
      },
      orderBy: { id: 'asc' },
    });
  },

  /**
   * Obtiene un tipo de cliente por su ID, incluyendo conteo de clientes asociados.
   * @param {string|number} id - ID del tipo de cliente.
   * @return {Promise<Object>} Tipo de cliente encontrado.
   * @throws {Error} Si el tipo de cliente no existe.
   * Observación: El ID se espera como un parámetro de ruta. Si el tipo de cliente no existe, se lanza un error 404.
   */
  async getByIdtiposdecliente(id) {
    return await prisma.tipoCliente.findUnique({
      where: { id: BigInt(id) },
      include: {
        _count: { select: { clientes: true } },
      },
    });
  },

  /**
   * Busca un tipo de cliente por nombre exacto (case-insensitive).
   * @param {string} nombre - Nombre del tipo de cliente a buscar.
   * @return {Promise<Object|null>} Tipo de cliente encontrado o null.
   * Observación: Se utiliza para validar la unicidad del nombre al crear o actualizar un tipo de cliente.
   */
  async getByNombretiposdecliente(nombre) {
    return await prisma.tipoCliente.findFirst({
      where: { nombre: { equals: nombre, mode: 'insensitive' } },
    });
  },

  /**
   * Crea un nuevo tipo de cliente.
   * @param {Object} data - Datos del tipo de cliente a crear.
   * @return {Promise<Object>} Tipo de cliente creado.
   * @throws {Error} Si el nombre del tipo de cliente es obligatorio o ya existe.
   * Observación: El nombre del tipo de cliente se espera en el cuerpo de la solicitud. Si el nombre ya existe, se lanza un error 400.
   */
  async create(data) {
    return await prisma.tipoCliente.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion || null,
        condicionPago: data.condicionPago || null,
        disponible: data.disponible !== undefined ? data.disponible : true,
      },
    });
  },

  /**
   * Actualiza un tipo de cliente existente.
   * @param {string|number} id - ID del tipo de cliente a actualizar.
   * @param {Object} data - Datos del tipo de cliente a actualizar.
   * @return {Promise<Object>} Tipo de cliente actualizado.
   * @throws {Error} Si el tipo de cliente no existe.
   * Observación: El ID se espera como un parámetro de ruta. Si el tipo de cliente no existe, se lanza un error 404.
   */
  async update(id, data) {
    const payload = {};
    if (data.nombre !== undefined) payload.nombre = data.nombre;
    if (data.descripcion !== undefined) payload.descripcion = data.descripcion;
    if (data.condicionPago !== undefined) payload.condicionPago = data.condicionPago;
    if (data.disponible !== undefined) payload.disponible = data.disponible;

    return await prisma.tipoCliente.update({
      where: { id: BigInt(id) },
      data: payload,
    });
  },

  /**
   * Cambia el estado (activo/inactivo) de un tipo de cliente.
   * @param {string|number} id - ID del tipo de cliente.
   * @param {boolean} disponible - Nuevo estado del tipo de cliente.
   * @return {Promise<Object>} Tipo de cliente actualizado.
   * @throws {Error} Si el tipo de cliente no existe.
   * Observación: El ID se espera como un parámetro de ruta. Si el tipo de cliente no existe, se lanza un error 404.
   */
  async cambiarEstado(id, disponible) {
    return await prisma.tipoCliente.update({
      where: { id: BigInt(id) },
      data: { disponible },
    });
  },

  /**
   * Cuenta los clientes asociados a un tipo de cliente.
   * @param {string|number} id - ID del tipo de cliente.
   * @return {Promise<number>} Número de clientes asociados.
   * @throws {Error} Si el tipo de cliente no existe.
   * Observación: Se utiliza para validar que no existan clientes asociados antes de desactivar un tipo de cliente.    
   */
  async countClientesByTipoId(id) {
    return await prisma.cliente.count({
      where: { tipoClienteId: BigInt(id) },
    });
  },
};

export default tipoClienteRepository;
