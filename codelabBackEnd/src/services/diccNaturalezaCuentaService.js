import { randomUUID } from 'crypto';
import diccNaturalezaCuentaRepository from '../repositories/diccNaturalezaCuentaRepository.js';

function buildError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

const diccNaturalezaCuentaService = {
  async list(query = {}) {
    const filters = {
      disponible:
        query.disponible === 'true'
          ? true
          : query.disponible === 'false'
            ? false
            : undefined,
      search: query.search?.trim() || undefined,
    };

    return diccNaturalezaCuentaRepository.list(filters);
  },

  async getById(id) {
    const naturaleza = await diccNaturalezaCuentaRepository.findById(BigInt(id));

    if (!naturaleza) {
      throw buildError('Naturaleza contable no encontrada.', 404);
    }

    return naturaleza;
  },

  async create(payload) {
    const nombre = payload?.nombre?.trim();
    const disponible =
      typeof payload?.disponible === 'boolean' ? payload.disponible : true;

    if (!nombre) {
      throw buildError('El nombre es obligatorio.');
    }

    const data = {
      uuidNaturaleza: randomUUID(),
      nombre: nombre.toUpperCase(),
      codigo: nombre.substring(0, 3).toUpperCase(),
      disponible,
    };

    return diccNaturalezaCuentaRepository.create(data);
  },

  async update(id, payload) {
    const naturalezaId = BigInt(id);
    const actual = await diccNaturalezaCuentaRepository.findById(naturalezaId);

    if (!actual) {
      throw buildError('Naturaleza contable no encontrada.', 404);
    }

    const data = {};

    if (payload?.nombre !== undefined) {
      const nombre = payload.nombre.trim();

      if (!nombre) {
        throw buildError('El nombre es obligatorio.');
      }

      const existente = await diccNaturalezaCuentaRepository.findByNombre(nombre);
      if (existente && existente.id.toString() !== naturalezaId.toString()) {
        throw buildError('Ya existe una naturaleza contable con ese nombre.', 409);
      }

      data.nombre = nombre;
    }

    if (payload?.disponible !== undefined) {
      data.disponible = Boolean(payload.disponible);
    }

    return diccNaturalezaCuentaRepository.update(naturalezaId, data);
  },

  async patchEstado(id, payload) {
    const naturalezaId = BigInt(id);
    const actual = await diccNaturalezaCuentaRepository.findById(naturalezaId);

    if (!actual) {
      throw buildError('Naturaleza contable no encontrada.', 404);
    }

    if (payload?.disponible === undefined) {
      throw buildError('El estado disponible es obligatorio.');
    }

    return diccNaturalezaCuentaRepository.update(naturalezaId, {
      disponible: Boolean(payload.disponible),
    });
  },
};

export default diccNaturalezaCuentaService;