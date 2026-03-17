import caiRepository from '../repositories/caiRepository.js';

function buildError(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function parseDateOrThrow(value, fieldName) {
  const date = new Date(value);

  if (!value || Number.isNaN(date.getTime())) {
    throw buildError(`El campo ${fieldName} es obligatorio y debe ser una fecha valida.`);
  }

  return date;
}

function parseBigIntOrThrow(value, fieldName) {
  if (value === undefined || value === null || value === '') {
    throw buildError(`El campo ${fieldName} es obligatorio.`);
  }

  const raw = String(value).trim();

  if (!/^\d+$/.test(raw)) {
    throw buildError(`El campo ${fieldName} debe ser un numero entero positivo.`);
  }

  return BigInt(raw);
}

const caiService = {
  async create(body = {}) {
    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
      throw buildError('Body invalido para crear CAI.');
    }

    const codigo = body.codigo ? String(body.codigo).trim() : '';
    if (!codigo) {
      throw buildError('El codigo del CAI es obligatorio.');
    }

    const fechaInicio = parseDateOrThrow(body.fechaInicio, 'fechaInicio');
    const fechaFin = parseDateOrThrow(body.fechaFin, 'fechaFin');

    if (fechaInicio > fechaFin) {
      throw buildError('La fecha de inicio no puede ser mayor a la fecha final.');
    }

    const inicioRango = parseBigIntOrThrow(body.inicioRango, 'inicioRango');
    const finalRango = parseBigIntOrThrow(body.finalRango, 'finalRango');

    if (inicioRango > finalRango) {
      throw buildError('El rango inicial no puede ser mayor que el rango final.');
    }

    const existente = await caiRepository.findByCodigo(codigo);
    if (existente) {
      throw buildError('Ya existe un CAI con ese codigo.', 409);
    }

    const ultimoCai = await caiRepository.findLastByFechaFin();
    if (ultimoCai) {
      if (fechaInicio <= ultimoCai.fechaFin || fechaFin <= ultimoCai.fechaFin) {
        throw buildError(
          'Las nuevas fechas de CAI deben ser mayores a las fechas anteriormente ingresadas.',
          409,
        );
      }
    }

    const ultimoRango = await caiRepository.findLastRangeByFinal();
    if (ultimoRango) {
      if (inicioRango <= ultimoRango.final_rango || finalRango <= ultimoRango.final_rango) {
        throw buildError(
          'El nuevo rango debe iniciar y finalizar despues del rango final anterior.',
          409,
        );
      }
    }

    return caiRepository.createWithRange({
      codigo,
      fechaInicio,
      fechaFin,
      inicioRango,
      finalRango,
    });
  },

  async listAll() {
    const data = await caiRepository.listAll();

    return data.map((item) => ({
      ...item,
      disponible: item.activo && new Date(item.fechaFin) >= new Date(),
    }));
  },

  async getLatestVigente() {
    const data = await caiRepository.findLatestVigente(new Date());

    if (!data) {
      throw buildError('No existe un CAI vigente.', 404);
    }

    return data;
  },
};

export default caiService;