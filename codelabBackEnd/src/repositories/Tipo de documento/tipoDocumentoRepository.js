import prisma from '../../infra/prisma/prismaClient.js';

/**
 * Repositorio para interactuar con la base de datos de tipos de documento usando Prisma
 */
const tipoDocumentoRepository = {
  /**
   * Obtiene todos los tipos de documento (tabla maestra)
   * @returns {Promise<Array>} Lista de tipos de documento
   */
  async getAllTiposDocumento() {
    return await prisma.tipoDocumento.findMany({
      orderBy: { numero: 'asc' },
    });
  },

  /**
   * Obtiene un tipo de documento por su ID
   * @param {BigInt|number|string} id - ID del tipo de documento
   * @returns {Promise<Object|null>} Tipo de documento encontrado o null
   */
  async getTipoDocumentoById(id) {
    return await prisma.tipoDocumento.findUnique({
      where: { id: BigInt(id) },
    });
  },

  /**
   * Busca un tipo de documento por ID (alias para validaciones)
   * @param {BigInt|number|string} id - ID del tipo de documento
   * @returns {Promise<Object|null>} Registro encontrado o null
   */
  findById(id) {
    return prisma.tipoDocumento.findUnique({
      where: { id: BigInt(id) },
      select: { id: true },
    });
  },

  /**
   * Crea un nuevo tipo de documento
   * @param {Object} data - Datos del tipo de documento
   * @returns {Promise<Object>} Tipo de documento creado
   */
  async createTipoDocumento(data) {
    return await prisma.$transaction(async (tx) => {
      const tipoDocumento = await tx.tipoDocumento.create({
        data: {
          numero: Number(data.numero),
          nombre: String(data.nombre),
          descripcion: data.descripcion ?? null,
          disponible: data.disponible ?? true,
        },
      });

      await tx.establecimientoTipoDocumento.upsert({
        where: {
          establecimientoId_tipoDocumentoId: {
            establecimientoId: 1n,
            tipoDocumentoId: tipoDocumento.id,
          },
        },
        create: {
          establecimientoId: 1n,
          tipoDocumentoId: tipoDocumento.id,
          disponible: true,
        },
        update: {
          disponible: true,
        },
      });

      return tipoDocumento;
    });
  },

  /**
   * Actualiza un tipo de documento existente
   * @param {BigInt|number|string} id - ID del tipo de documento
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>} Tipo de documento actualizado
   */
  async updateTipoDocumento(id, data) {
    return await prisma.tipoDocumento.update({
      where: { id: BigInt(id) },
      data,
    });
  },

  /**
   * Cambia el estado de un tipo de documento (maestro)
   * @param {BigInt|number|string} id - ID del tipo de documento
   * @param {boolean} disponible - Nuevo estado
   * @returns {Promise<Object>} Tipo de documento actualizado
   */
  async updateTipoDocumentoStatus(id, disponible) {
    return await prisma.tipoDocumento.update({
      where: { id: BigInt(id) },
      data: { disponible: Boolean(disponible) },
    });
  },

  /**
   * Desactiva en cascada la disponibilidad en establecimientos por tipo_documento
   * @param {BigInt|number|string} id_tipo_documento
   * @returns {Promise<Object>} Resultado updateMany
   */
  async disableAsignacionesByTipoDocumento(id_tipo_documento) {
    return await prisma.establecimientoTipoDocumento.updateMany({
      where: { tipoDocumentoId: BigInt(id_tipo_documento) },
      data: { disponible: false },
    });
  },

  /**
   * Obtiene documentos configurados para un establecimiento
   * @param {BigInt|number|string} id_establecimiento
   * @returns {Promise<Array>}
   */
  async getDocumentosByEstablecimiento(id_establecimiento) {
    return await prisma.establecimientoTipoDocumento.findMany({
      where: { establecimientoId: BigInt(id_establecimiento) },
      include: { tipoDocumento: true },
      orderBy: { id: 'asc' },
    });
  },

  /**
   * Obtiene un establecimiento por su ID
   * @param {BigInt|number|string} id_establecimiento
   * @returns {Promise<Object|null>} Establecimiento encontrado o null
   */
  async getEstablecimientoById(id_establecimiento) {
    return await prisma.establecimiento.findUnique({
      where: { id: BigInt(id_establecimiento) },
    });
  },

  /**
   * Asigna (o reactiva) un tipo_documento a un establecimiento
   * @param {BigInt|number|string} id_establecimiento
   * @param {BigInt|number|string} id_tipo_documento
   * @returns {Promise<Object>}
   */
  async assignDocumentoToEstablecimiento(id_establecimiento, id_tipo_documento) {
    return await prisma.establecimientoTipoDocumento.upsert({
      where: {
        establecimientoId_tipoDocumentoId: {
          establecimientoId: BigInt(id_establecimiento),
          tipoDocumentoId: BigInt(id_tipo_documento),
        },
      },
      create: {
        establecimientoId: BigInt(id_establecimiento),
        tipoDocumentoId: BigInt(id_tipo_documento),
        disponible: true,
      },
      update: {
        disponible: true,
      },
      include: {
        tipoDocumento: true,
      },
    });
  },

  /**
   * Desasigna (disponible=false) un tipo_documento de un establecimiento
   * @param {BigInt|number|string} id_establecimiento
   * @param {BigInt|number|string} id_tipo_documento
   * @returns {Promise<Object>}
   */
  async unassignDocumentoFromEstablecimiento(id_establecimiento, id_tipo_documento) {
    return await prisma.establecimientoTipoDocumento.update({
      where: {
        establecimientoId_tipoDocumentoId: {
          establecimientoId: BigInt(id_establecimiento),
          tipoDocumentoId: BigInt(id_tipo_documento),
        },
      },
      data: { disponible: false },
      include: { tipoDocumento: true },
    });
  },

  /**
   * Cambia estado en tabla intermedia por id_establecimiento_tipo_documento
   * @param {BigInt|number|string} id - id_establecimiento_tipo_documento
   * @param {boolean} disponible
   * @returns {Promise<Object>}
   */
  async patchEstadoEstablecimientoDocumento(id, disponible) {
    return await prisma.establecimientoTipoDocumento.update({
      where: { id: BigInt(id) },
      data: { disponible: Boolean(disponible) },
      include: { tipoDocumento: true },
    });
  },

  /**
   * Trae puntosEmision y rangoEmision por id_establecimiento_tipo_documento
   * @param {BigInt|number|string} id
   * @returns {Promise<Object|null>}
   */
  async getPuntosEmisionYRangoByEstTipoDoc(id) {
    return await prisma.establecimientoTipoDocumento.findUnique({
      where: { id: BigInt(id) },
      include: {
        puntosEmision: {
          include: {
            rangoEmision: {
              include: { cai: true },
            },
          },
          orderBy: { numero: 'asc' },
        },
      },
    });
  },
};

export default tipoDocumentoRepository;