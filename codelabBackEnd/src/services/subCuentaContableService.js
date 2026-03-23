import { randomUUID } from 'crypto';
import subCuentaContableRepository from '../repositories/subCuentaContableRepository.js';
import elementoContableRepository from '../repositories/elementoContableRepository.js';
import clasificacionElementoContableRepository from '../repositories/clasificacionElementoContableRepository.js';
import cuentaContableRepository from '../repositories/cuentaContableRepository.js';

function buildError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

const subCuentaContableService = {
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
      uuidCuentaContable: query.uuidCuentaContable || undefined,
      search: query.search?.trim() || undefined,
    };

    return subCuentaContableRepository.list(filters);
  },

  async getById(id) {
    const subCuenta = await subCuentaContableRepository.findById(BigInt(id));

    if (!subCuenta) {
      throw buildError('Subcuenta contable no encontrada.', 404);
    }

    return subCuenta;
  },

  async create(payload) {
    const nombre = payload?.nombre?.trim();
    const uuidElementoContable = payload?.uuidElementoContable?.trim();
    const uuidClasificacionContable = payload?.uuidClasificacionContable?.trim();
    const uuidCuentaContable = payload?.uuidCuentaContable?.trim();
    const idNaturaleza = payload?.idNaturaleza ? BigInt(payload.idNaturaleza) : null;
    const disponible = typeof payload?.disponible === 'boolean' ? payload.disponible : true;

    if (!nombre) {
      throw buildError('El nombre es obligatorio.');
    }

    if (!uuidElementoContable) {
      throw buildError('El elemento contable es obligatorio.');
    }

    if (!uuidClasificacionContable) {
      throw buildError('La clasificación contable es obligatoria.');
    }

    if (!uuidCuentaContable) {
      throw buildError('La cuenta contable es obligatoria.');
    }

    if (!idNaturaleza) {
      throw buildError('La naturaleza es obligatoria.');
    }

    const elemento = await elementoContableRepository.findByUuid(uuidElementoContable);
    if (!elemento) {
      throw buildError('El elemento contable no existe.', 404);
    }

    const clasificacion =
      await clasificacionElementoContableRepository.findByUuid(uuidClasificacionContable);
    if (!clasificacion) {
      throw buildError('La clasificación contable no existe.', 404);
    }

    const cuenta = await cuentaContableRepository.findByUuid(uuidCuentaContable);
    if (!cuenta) {
      throw buildError('La cuenta contable no existe.', 404);
    }

    if (clasificacion.uuidElementoContable !== uuidElementoContable) {
      throw buildError('La clasificación no pertenece al elemento contable indicado.');
    }

    if (cuenta.uuidElementoContable !== uuidElementoContable) {
      throw buildError('La cuenta no pertenece al elemento contable indicado.');
    }

    if (cuenta.uuidClasificacionContable !== uuidClasificacionContable) {
      throw buildError('La cuenta no pertenece a la clasificación indicada.');
    }

    const subCuentas = await subCuentaContableRepository.list({
      uuidCuentaContable,
    });

    const maxCodigo = subCuentas.reduce(
      (max, item) => (item.codigoNumerico > max ? item.codigoNumerico : max),
      0,
    );

    const data = {
      uuidSubCuentaContable: randomUUID(),
      nombre,
      disponible,
      uuidElementoContable,
      uuidClasificacionContable,
      uuidCuentaContable,
      codigoNumerico: maxCodigo + 1,
      idNaturaleza,
    };

    return subCuentaContableRepository.create(data);
  },

  async update(id, payload) {
    const subCuentaId = BigInt(id);
    const actual = await subCuentaContableRepository.findById(subCuentaId);

    if (!actual) {
      throw buildError('Subcuenta contable no encontrada.', 404);
    }

    const data = {};

    if (payload?.nombre !== undefined) {
      const nombre = payload.nombre.trim();
      if (!nombre) {
        throw buildError('El nombre es obligatorio.');
      }
      data.nombre = nombre;
    }

    if (payload?.idNaturaleza !== undefined) {
      data.idNaturaleza = BigInt(payload.idNaturaleza);
    }

    if (payload?.disponible !== undefined) {
      data.disponible = Boolean(payload.disponible);
    }

    return subCuentaContableRepository.update(subCuentaId, data);
  },

  async patchEstado(id, payload) {
    const subCuentaId = BigInt(id);
    const actual = await subCuentaContableRepository.findById(subCuentaId);

    if (!actual) {
      throw buildError('Subcuenta contable no encontrada.', 404);
    }

    if (payload?.disponible === undefined) {
      throw buildError('El estado disponible es obligatorio.');
    }

    return subCuentaContableRepository.update(subCuentaId, {
      disponible: Boolean(payload.disponible),
    });
  },
};

export default subCuentaContableService;