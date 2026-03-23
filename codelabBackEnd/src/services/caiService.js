import caiRepository from '../repositories/caiRepository.js';
import tipoDocumentoRepository from '../repositories/tipoDocumentoRepository.js';

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

    const tipoDocumentoId = parseBigIntOrThrow(
      body.tipoDocumentoId ?? body.id_tipo_documento,
      'tipoDocumentoId',
    );
    const fechaInicio = parseDateOrThrow(body.fechaInicio, 'fechaInicio');
    const fechaFin = parseDateOrThrow(body.fechaFin, 'fechaFin');

    if (fechaInicio > fechaFin) {
      throw buildError('La fecha de vencimiento no puede ser menor a la fecha de inicio.');
    }

    const inicioRango = parseBigIntOrThrow(body.inicioRango, 'inicioRango');
    const finalRango = parseBigIntOrThrow(body.finalRango, 'finalRango');

    if (inicioRango > finalRango) {
      throw buildError('El rango final no puede ser menor al rango inicial.');
    }

    const existente = await caiRepository.findByCodigo(codigo);
    if (existente) {
      throw buildError('Ya existe un CAI con ese codigo.', 409);
    }

    const tipoDocumento = await tipoDocumentoRepository.findById(tipoDocumentoId);
    if (!tipoDocumento) {
      throw buildError('El tipo de documento indicado no existe.', 404);
    }

    return caiRepository.createWithRange({
      codigo,
      tipoDocumentoId,
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

  async getByIdOrLatestVigente(id) {
    const data =
      id !== undefined && id !== null && id !== ''
        ? await caiRepository.findByIdDetailed(parseBigIntOrThrow(id, 'id_cai'))
        : await caiRepository.findLatestVigenteDetailed();

    if (!data) {
      throw buildError(
        id !== undefined && id !== null && id !== ''
          ? 'No existe un CAI con el id indicado.'
          : 'No existe un CAI vigente.',
        404,
      );
    }

    return {
      ...data,
      disponible: data.activo && new Date(data.fechaFin) >= new Date(),
    };
  },
};

export default caiService;
