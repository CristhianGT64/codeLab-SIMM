import tipoDocumentoRepository from '../repositories/tipoDocumentoRepository.js';

/**
 * Servicio para la lógica de negocio relacionada con tipos de documento
 */
const tipoDocumentoService = {
  /**
   * Serializa TipoDocumento con IDs BigInt a string
   * @param {Object} row
   * @returns {Object}
   */
  mapTipoDocumento(row) {
    return {
      id_tipo_documento: row.id.toString(),
      numero: row.numero,
      nombre: row.nombre,
      disponible: row.disponible,
    };
  },

  /**
   * Serializa la relación establecimiento_tipo_documento
   * @param {Object} row
   * @returns {Object}
   */
  mapEstablecimientoDocumento(row) {
    return {
      id_establecimiento_tipo_documento: row.id.toString(),
      id_establecimiento: row.establecimientoId.toString(),
      id_tipo_documento: row.tipoDocumentoId.toString(),
      disponible: row.disponible,
      tipo_documento: row.tipoDocumento
        ? {
            id_tipo_documento: row.tipoDocumento.id.toString(),
            numero: row.tipoDocumento.numero,
            nombre: row.tipoDocumento.nombre,
            disponible: row.tipoDocumento.disponible,
          }
        : null,
    };
  },

  /**
   * Obtiene todos los tipos de documento (tabla maestra)
   * @returns {Promise<Array>}
   */
  async getAll() {
    const rows = await tipoDocumentoRepository.getAllTiposDocumento();
    return rows.map((r) => this.mapTipoDocumento(r));
  },

  /**
   * Obtiene un tipo de documento por ID
   * @param {BigInt|number|string} id
   * @returns {Promise<Object>}
   */
  async getById(id) {
    const row = await tipoDocumentoRepository.getTipoDocumentoById(BigInt(id));
    if (!row) {
      const error = new Error('Tipo de documento no encontrado');
      error.status = 404;
      throw error;
    }
    return this.mapTipoDocumento(row);
  },

  /**
   * Crea un tipo de documento maestro.
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    const row = await tipoDocumentoRepository.createTipoDocumento(data);
    return this.mapTipoDocumento(row);
  },

  /**
   * Actualiza un tipo de documento
   * Si disponible=false en maestra, desactiva en cascada todas las asignaciones de ese documento en los establecimientos (disponible=false)
   * @param {BigInt|number|string} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    await this.getById(id);

    const row = await tipoDocumentoRepository.updateTipoDocumento(BigInt(id), data);

    if (data?.disponible === false) {
      try {
        await tipoDocumentoRepository.disableAsignacionesByTipoDocumento(BigInt(id));
      } catch (_) {
        // tabla intermedia aún no migrada, se ignora
      }
    }

    return this.mapTipoDocumento(row);
  },

  /**
   * Cambia el estado (disponible) de un tipo de documento maestro
   * @param {BigInt|number|string} id
   * @returns {Promise<Object>}
   */
  async changeStatus(id) {
    const tipo = await tipoDocumentoRepository.getTipoDocumentoById(BigInt(id));

    if (!tipo) {
      const error = new Error('Tipo de documento no encontrado');
      error.status = 404;
      throw error;
    }

    const nuevoEstado = !tipo.disponible;

    const actualizado = await tipoDocumentoRepository.updateTipoDocumentoStatus(
      BigInt(id),
      nuevoEstado
    );

    // Este bloque se asegura que si el tipo de documento (maestro) se desactiva, todas las asignaciones a establecimientos también se desactiven (disponible=false)
    if (nuevoEstado === false) {
      try {
        await tipoDocumentoRepository.disableAsignacionesByTipoDocumento(BigInt(id));
      } catch (_) {
        // Si la tabla intermedia aún no existe/migrada, no rompe el flujo maestro
      }
    }

    //Ejemplos de los casos: 
    //Si se desactiva un tipo de documento maestro → se desactivan también sus asignaciones en establecimientos.
    //Si se activa (true) → no se reactivan automáticamente las asignaciones.

    return this.mapTipoDocumento(actualizado);
  },

  /**
   * Lista documentos configurados para un establecimiento
   * @param {BigInt|number|string} id_establecimiento
   * @returns {Promise<Array>}
   */
  async getByEstablecimiento(id_establecimiento) {
    const rows = await tipoDocumentoRepository.getDocumentosByEstablecimiento(
      BigInt(id_establecimiento)
    );
    return rows.map((r) => this.mapEstablecimientoDocumento(r));
  },

  /**
   * Asigna un tipo de documento a establecimiento
   * @param {BigInt|number|string} id_establecimiento
   * @param {BigInt|number|string} id_tipo_documento
   * @returns {Promise<Object>}
   */
  async assignDocumento(id_establecimiento, id_tipo_documento) {
    const establecimiento = await tipoDocumentoRepository.getEstablecimientoById(
      BigInt(id_establecimiento)
    );

    if (!establecimiento) {
      const error = new Error('Establecimiento no encontrado');
      error.status = 404;
      throw error;
    }

    const tipo = await tipoDocumentoRepository.getTipoDocumentoById(BigInt(id_tipo_documento));
    if (!tipo) {
      const error = new Error('Tipo de documento no encontrado');
      error.status = 404;
      throw error;
    }

    const row = await tipoDocumentoRepository.assignDocumentoToEstablecimiento(
      BigInt(id_establecimiento),
      BigInt(id_tipo_documento)
    );

    return this.mapEstablecimientoDocumento(row); // IDs serializados a string
  },

  /**
   * Desasigna (disponible=false) un tipo de documento a establecimiento
   * @param {BigInt|number|string} id_establecimiento
   * @param {BigInt|number|string} id_tipo_documento
   * @returns {Promise<Object>}
   */
  async unassignDocumento(id_establecimiento, id_tipo_documento) {
    const row = await tipoDocumentoRepository.unassignDocumentoFromEstablecimiento(
      BigInt(id_establecimiento),
      BigInt(id_tipo_documento)
    );
    return this.mapEstablecimientoDocumento(row);
  },

  /**
   * Cambia estado disponible en tabla intermedia por id_establecimiento_tipo_documento
   * @param {BigInt|number|string} id
   * @param {boolean} disponible
   * @returns {Promise<Object>}
   */
  async patchEstadoEstablecimientoDocumento(id, disponible) {
    const row = await tipoDocumentoRepository.patchEstadoEstablecimientoDocumento(
      BigInt(id),
      Boolean(disponible)
    );
    return this.mapEstablecimientoDocumento(row);
  },

  /**
   * Consulta puntosEmision y rangoEmision por id_establecimiento_tipo_documento
   * @param {BigInt|number|string} id
   * @returns {Promise<Object|null>}
   */
  async getPuntosEmisionYRango(id) {
    const row = await tipoDocumentoRepository.getPuntosEmisionYRangoByEstTipoDoc(BigInt(id));
    if (!row) return null;

    return {
      id_establecimiento_tipo_documento: row.id.toString(),
      puntos_emision: row.puntosEmision.map((p) => ({
        id_punto_emision: p.id.toString(),
        id_tipo_documento: p.tipoDocumentoId.toString(),
        id_establecimiento: p.establecimientoId.toString(),
        numero: p.numero,
        disponible: p.disponible,
        rango_emision: p.rangoEmision
          ? {
              id_rango_emision: p.rangoEmision.id.toString(),
              inicio_rango: p.rangoEmision.inicioRango.toString(),
              final_rango: p.rangoEmision.finRango.toString(),
            }
          : null,
      })),
    };
  },
};

export default tipoDocumentoService;