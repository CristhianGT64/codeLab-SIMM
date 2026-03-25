import { randomUUID } from 'crypto';
import cuentaContableRepository from '../repositories/cuentaContableRepository.js';
import elementoContableRepository from '../repositories/elementoContableRepository.js';
import clasificacionElementoContableRepository from '../repositories/clasificacionElementoContableRepository.js';
import diccNaturalezaCuentaRepository from '../repositories/diccNaturalezaCuentaRepository.js';

function buildError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

const cuentaContableService = {
  async list(query = {}) {
    const filters = {
      disponible:
        query.disponible === 'true'
          ? true
          : query.disponible === 'false'
            ? false
            : undefined,
      uuidElementoContable: query.uuidElementoContable || undefined,
      uuidClasificacionContable: query.uuidClasificacionContable || undefined,
      search: query.search?.trim() || undefined,
    };

    return cuentaContableRepository.list(filters);
  },

  async getById(id) {
    const cuenta = await cuentaContableRepository.findById(BigInt(id));

    if (!cuenta) {
      throw buildError('Cuenta contable no encontrada.', 404);
    }

    return cuenta;
  },

  async create(payload) {
    const nombre = payload?.nombre?.trim();
    const uuidElementoContable = payload?.uuidElementoContable?.trim();
    const uuidClasificacionContable = payload?.uuidClasificacionContable?.trim();
    const idNaturaleza = payload?.idNaturaleza ? BigInt(payload.idNaturaleza) : null;
    const disponible = typeof payload?.disponible === 'boolean' ? payload.disponible : true;

    if (!nombre) throw buildError('El nombre es obligatorio.');
    if (!uuidElementoContable) throw buildError('El elemento contable es obligatorio.');
    if (!uuidClasificacionContable) throw buildError('La clasificación contable es obligatoria.');
    if (!idNaturaleza) throw buildError('La naturaleza es obligatoria.');

    const naturaleza = await diccNaturalezaCuentaRepository.findById(idNaturaleza);
    if (!naturaleza) throw buildError('La naturaleza no existe.', 404);

    const elemento = await elementoContableRepository.findByUuid(uuidElementoContable);
    if (!elemento) throw buildError('El elemento contable no existe.', 404);

    const clasificacion =
      await clasificacionElementoContableRepository.findByUuid(uuidClasificacionContable);
    if (!clasificacion) throw buildError('La clasificación contable no existe.', 404);

    if (clasificacion.uuidElementoContable !== uuidElementoContable) {
      throw buildError('La clasificación no pertenece al elemento contable.');
    }

    if (elemento.idNaturaleza !== idNaturaleza) {
      throw buildError('La naturaleza no coincide con la del elemento contable.');
    }

    const cuentas = await cuentaContableRepository.list({ uuidClasificacionContable });

    const maxCodigo = cuentas.reduce(
      (max, item) => (item.codigoNumerico > max ? item.codigoNumerico : max),
      0,
    );

    const data = {
      uuidCuentaContable: randomUUID(),
      nombre,
      disponible,
      uuidElementoContable,
      uuidClasificacionContable,
      codigoNumerico: maxCodigo + 1,
      idNaturaleza,
    };

    return cuentaContableRepository.create(data);
  },

  async update(id, payload) {
    const cuentaId = BigInt(id);
    const actual = await cuentaContableRepository.findById(cuentaId);

    if (!actual) {
      throw buildError('Cuenta contable no encontrada.', 404);
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

    return cuentaContableRepository.update(cuentaId, data);
  },

  async patchEstado(id, payload) {
    const cuentaId = BigInt(id);
    const actual = await cuentaContableRepository.findById(cuentaId);

    if (!actual) {
      throw buildError('Cuenta contable no encontrada.', 404);
    }

    if (payload?.disponible === undefined) {
      throw buildError('El estado disponible es obligatorio.');
    }

    return cuentaContableRepository.update(cuentaId, {
      disponible: Boolean(payload.disponible),
    });
  },
};

export default cuentaContableService;