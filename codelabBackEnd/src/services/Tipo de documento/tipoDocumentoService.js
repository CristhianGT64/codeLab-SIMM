import tipoDocumentoRepository from '../../repositories/Tipo de documento/tipoDocumentoRepository.js';

/**
 * Servicio para la lógica de negocio relacionada con tipos de documento
 */
const tipoDocumentoService = {
  buildPrefijo(numero) {
    return `0${Math.trunc(Number(numero))}`;
  },

  getFirstDefinedValue(...values) {
    return values.find((value) => value !== undefined && value !== null);
  },

  /**
   * Serializa TipoDocumento con IDs BigInt a string
   * @param {Object} row
   * @returns {Object}
   */
  mapTipoDocumento(row) {
    return {
      id_tipo_documento: row.id.toString(),
      numero: row.numero,
      prefijo: this.buildPrefijo(row.numero),
      nombre: row.nombre,
      descripcion: row.descripcion ?? '',
      disponible: row.disponible,
      created_at: row.createdAt,
      updated_at: row.updatedAt,
      requiere_cai: true,
      cai: true,
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
            prefijo: this.buildPrefijo(row.tipoDocumento.numero),
            nombre: row.tipoDocumento.nombre,
            descripcion: row.tipoDocumento.descripcion ?? '',
            disponible: row.tipoDocumento.disponible,
            created_at: row.tipoDocumento.createdAt,
            updated_at: row.tipoDocumento.updatedAt,
            requiere_cai: true,
            cai: true,
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
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      const error = new Error('Body invalido para crear tipo de documento');
      error.status = 400;
      throw error;
    }

    const establecimientoFijo = this.getFirstDefinedValue(
      data.establecimientoId,
      data.idEstablecimiento,
      data.establecimiento_id,
      data.id_establecimiento,
      data.establecimiento
    );
    if (establecimientoFijo !== undefined && Number(establecimientoFijo) !== 1) {
      const error = new Error('El establecimiento para tipos de documento esta fijo en 1');
      error.status = 400;
      throw error;
    }

    const puntoEmisionFijo = this.getFirstDefinedValue(
      data.puntoEmision,
      data.puntoEmisionId,
      data.idPuntoEmision,
      data.punto_emision,
      data.punto_emision_id,
      data.id_punto_emision
    );
    if (puntoEmisionFijo !== undefined && Number(puntoEmisionFijo) !== 1) {
      const error = new Error('El punto de emision para tipos de documento esta fijo en 1');
      error.status = 400;
      throw error;
    }

    if (!data.nombre || String(data.nombre).trim() === '') {
      const error = new Error('El nombre del tipo de documento es obligatorio');
      error.status = 400;
      throw error;
    }

    if (data.numero === undefined || data.numero === null || String(data.numero).trim() === '') {
      const error = new Error('El numero del tipo de documento es obligatorio');
      error.status = 400;
      throw error;
    }

    const numero = Number(data.numero);
    if (!Number.isInteger(numero) || numero <= 0) {
      const error = new Error('El numero del tipo de documento debe ser un entero positivo');
      error.status = 400;
      throw error;
    }

    const establecimientoPrincipal = await tipoDocumentoRepository.getEstablecimientoById(1n);
    if (!establecimientoPrincipal) {
      const error = new Error('No existe el establecimiento principal con id 1');
      error.status = 400;
      throw error;
    }

    const row = await tipoDocumentoRepository.createTipoDocumento({
      numero,
      nombre: String(data.nombre).trim(),
      descripcion:
        data.descripcion === undefined || data.descripcion === null
          ? null
          : String(data.descripcion).trim(),
      disponible: data.disponible ?? true,
    });
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

    const updatePayload = {};

    if (data?.nombre !== undefined) {
      if (String(data.nombre).trim() === '') {
        const error = new Error('El nombre del tipo de documento es obligatorio');
        error.status = 400;
        throw error;
      }

      updatePayload.nombre = String(data.nombre).trim();
    }

    if (data?.descripcion !== undefined) {
      updatePayload.descripcion = data.descripcion === null ? null : String(data.descripcion).trim();
    }

    if (data?.activo !== undefined) {
      updatePayload.disponible = Boolean(data.activo);
    }

    if (data?.disponible !== undefined) {
      updatePayload.disponible = Boolean(data.disponible);
    }

    if (data?.codigo !== undefined || data?.numero !== undefined) {
      const numeroActualizado = Number(data.numero ?? data.codigo);

      if (!Number.isInteger(numeroActualizado) || numeroActualizado <= 0) {
        const error = new Error('El numero del tipo de documento debe ser un entero positivo');
        error.status = 400;
        throw error;
      }

      updatePayload.numero = numeroActualizado;
    }

    const row = await tipoDocumentoRepository.updateTipoDocumento(BigInt(id), updatePayload);

    if (updatePayload.disponible === false) {
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
    if (BigInt(id_establecimiento) !== 1n) {
      const error = new Error('Solo se permite trabajar con el establecimiento 1');
      error.status = 400;
      throw error;
    }

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