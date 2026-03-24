import { randomUUID } from 'crypto';
import clasificacionElementoContableRepository from '../repositories/clasificacionElementoContableRepository.js';
import elementoContableRepository from '../repositories/elementoContableRepository.js';

function buildError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

const clasificacionElementoContableService = {
  async list(query = {}) {
    const filters = {
      disponible:
        query.disponible === 'true'
          ? true
          : query.disponible === 'false'
            ? false
            : undefined,
      uuidElementoContable: query.uuidElementoContable || undefined,
      search: query.search?.trim() || undefined,
    };

    return clasificacionElementoContableRepository.list(filters);
  },

  async getById(id) {
    const clasificacion = await clasificacionElementoContableRepository.findById(BigInt(id));

    if (!clasificacion) {
      throw buildError('Clasificación contable no encontrada.', 404);
    }

    return clasificacion;
  },

  async create(payload) {
    const nombre = payload?.nombre?.trim();
    const uuidElementoContable = payload?.uuidElementoContable?.trim();
    const disponible = typeof payload?.disponible === 'boolean' ? payload.disponible : true;

    if (!nombre) {
      throw buildError('El nombre es obligatorio.');
    }

    if (!uuidElementoContable) {
      throw buildError('El elemento contable es obligatorio.');
    }

    const elemento = await elementoContableRepository.findByUuid(uuidElementoContable);
    if (!elemento) {
      throw buildError('El elemento contable no existe.', 404);
    }

    const clasificaciones = await clasificacionElementoContableRepository.list({
      uuidElementoContable,
    });

    const maxCodigo = clasificaciones.reduce(
      (max, item) => (item.codigoNumerico > max ? item.codigoNumerico : max),
      0,
    );

    const data = {
      uuidClasificacionContable: randomUUID(),
      nombre,
      disponible,
      codigoNumerico: maxCodigo + 1,
      uuidElementoContable,
    };

    return clasificacionElementoContableRepository.create(data);
  },

  async update(id, payload) {
    const clasificacionId = BigInt(id);
    const actual = await clasificacionElementoContableRepository.findById(clasificacionId);

    if (!actual) {
      throw buildError('Clasificación contable no encontrada.', 404);
    }

    const data = {};

    if (payload?.nombre !== undefined) {
      const nombre = payload.nombre.trim();
      if (!nombre) {
        throw buildError('El nombre es obligatorio.');
      }
      data.nombre = nombre;
    }

    if (payload?.disponible !== undefined) {
      data.disponible = Boolean(payload.disponible);
    }

    return clasificacionElementoContableRepository.update(clasificacionId, data);
  },

  async patchEstado(id, payload) {
    const clasificacionId = BigInt(id);
    const actual = await clasificacionElementoContableRepository.findById(clasificacionId);

    if (!actual) {
      throw buildError('Clasificación contable no encontrada.', 404);
    }

    if (payload?.disponible === undefined) {
      throw buildError('El estado disponible es obligatorio.');
    }

    return clasificacionElementoContableRepository.update(clasificacionId, {
      disponible: Boolean(payload.disponible),
    });
  },
};

export default clasificacionElementoContableService;