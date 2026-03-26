import { randomUUID } from 'crypto';
import elementoContableRepository from '../repositories/elementoContableRepository.js';
import diccNaturalezaCuentaRepository from '../repositories/diccNaturalezaCuentaRepository.js';
import prisma from '../infra/prisma/prismaClient.js';

function buildError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

const elementoContableService = {
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

    return elementoContableRepository.list(filters);
  },

  async getById(id) {
    const elemento = await elementoContableRepository.findById(BigInt(id));

    if (!elemento) {
      throw buildError('Elemento contable no encontrado.', 404);
    }

    return elemento;
  },

  async create(payload) {
    const nombre = payload?.nombre?.trim();
    const idNaturaleza = payload?.idNaturaleza ? BigInt(payload.idNaturaleza) : null;
    const disponible = typeof payload?.disponible === 'boolean' ? payload.disponible : true;

    if (!nombre) {
      throw buildError('El nombre es obligatorio.');
    }

    if (!idNaturaleza) {
      throw buildError('La naturaleza es obligatoria.');
    }

    const naturaleza = await diccNaturalezaCuentaRepository.findById(idNaturaleza);
    if (!naturaleza) {
      throw buildError('La naturaleza contable no existe.', 404);
    }

    const existentes = await elementoContableRepository.list({});

    const maxCodigo = existentes.reduce(
      (max, item) => (item.codigoNumerico > max ? item.codigoNumerico : max),
      0
    );

    const data = {
      uuidElementoContable: randomUUID(),
      nombre,
      disponible,
      codigoNumerico: maxCodigo + 1,
      idNaturaleza,
    };

    return elementoContableRepository.create(data);
  },

  async update(id, payload) {
    const elementoId = BigInt(id);
    const actual = await elementoContableRepository.findById(elementoId);

    if (!actual) {
      throw buildError('Elemento contable no encontrado.', 404);
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
      const naturalezaId = BigInt(payload.idNaturaleza);
      const naturaleza = await diccNaturalezaCuentaRepository.findById(naturalezaId);

      if (!naturaleza) {
        throw buildError('La naturaleza contable no existe.', 404);
      }

      data.idNaturaleza = naturalezaId;
    }

    if (payload?.disponible !== undefined) {
      data.disponible = Boolean(payload.disponible);
    }

    return elementoContableRepository.update(elementoId, data);
  },

  async patchEstado(id, payload) {
    const elementoId = BigInt(id);
    const actual = await elementoContableRepository.findById(elementoId);

    if (!actual) {
      throw buildError('Elemento contable no encontrado.', 404);
    }

    if (payload?.disponible === undefined) {
      throw buildError('El estado disponible es obligatorio.');
    }

    const disponible = Boolean(payload.disponible);

    if (!disponible) {
      await prisma.clasificacionElementoContable.updateMany({
        where: { uuidElementoContable: actual.uuidElementoContable },
        data: { disponible: false },
      });
      await prisma.cuentaContable.updateMany({
        where: { uuidElementoContable: actual.uuidElementoContable },
        data: { disponible: false },
      });
      await prisma.subCuentaContable.updateMany({
        where: { uuidElementoContable: actual.uuidElementoContable },
        data: { disponible: false },
      });
    }

    return elementoContableRepository.update(elementoId, { disponible });
  },
};

export default elementoContableService;