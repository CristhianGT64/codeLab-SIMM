import impuestoRepository from '../repositories/impuestoRepository.js';

const MAX_NOMBRE_LENGTH = 150;

const normalizeBody = (body) => {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    const err = new Error('Body inválido para gestionar impuestos.');
    err.status = 400;
    throw err;
  }

  return body;
};

const normalizeNombre = (value) => {
  const nombre = String(value ?? '').trim();

  if (!nombre) {
    const err = new Error('nombre es obligatorio.');
    err.status = 400;
    throw err;
  }

  if (nombre.length > MAX_NOMBRE_LENGTH) {
    const err = new Error(`nombre no puede tener más de ${MAX_NOMBRE_LENGTH} caracteres.`);
    err.status = 400;
    throw err;
  }

  return nombre;
};

const normalizeTasa = (value) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    const err = new Error('porcentaje debe ser un número válido.');
    err.status = 400;
    throw err;
  }

  const tasa = Math.abs(parsed) > 1 ? parsed / 100 : parsed;

  if (tasa <= 0 || tasa > 1) {
    const err = new Error('porcentaje debe ser mayor a 0 y menor o igual a 100.');
    err.status = 400;
    throw err;
  }

  return Number(tasa.toFixed(4));
};

const impuestoService = {
  list() {
    return impuestoRepository.list();
  },

  async create(body = {}) {
    const normalizedBody = normalizeBody(body);
    const nombre = normalizeNombre(normalizedBody.nombre);
    const tasa = normalizeTasa(normalizedBody.porcentaje ?? normalizedBody.tasa);

    const existing = await impuestoRepository.findByNombre(nombre);

    if (existing) {
      const err = new Error('Ya existe un impuesto con ese nombre.');
      err.status = 409;
      throw err;
    }

    return impuestoRepository.create({
      nombre,
      tasa,
      activo: normalizedBody.activo ?? true,
    });
  },

  async update(id, body = {}) {
    normalizeBody(body);

    if (!id) {
      const err = new Error('id es obligatorio.');
      err.status = 400;
      throw err;
    }

    const actual = await impuestoRepository.findById(id);

    if (!actual) {
      const err = new Error('No se encontró el impuesto solicitado.');
      err.status = 404;
      throw err;
    }

    const data = {};

    if (body.nombre !== undefined) {
      const nombre = normalizeNombre(body.nombre);
      const existing = await impuestoRepository.findByNombre(nombre, id);

      if (existing) {
        const err = new Error('Ya existe un impuesto con ese nombre.');
        err.status = 409;
        throw err;
      }

      data.nombre = nombre;
    }

    if (body.porcentaje !== undefined || body.tasa !== undefined) {
      data.tasa = normalizeTasa(body.porcentaje ?? body.tasa);
    }

    if (body.activo !== undefined) {
      data.activo = Boolean(body.activo);
    }

    if (Object.keys(data).length === 0) {
      const err = new Error('Debes enviar al menos un campo para actualizar el impuesto.');
      err.status = 400;
      throw err;
    }

    return impuestoRepository.update(id, data);
  },
};

export default impuestoService;
