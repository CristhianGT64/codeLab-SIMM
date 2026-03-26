import { buildCaiError } from './caiErrors.js';

export function parseDateOrThrow(value, fieldName) {
  const date = new Date(value);

  if (!value || Number.isNaN(date.getTime())) {
    throw buildCaiError(`El campo ${fieldName} es obligatorio y debe ser una fecha valida.`);
  }

  return date;
}

export function parseBigIntOrThrow(value, fieldName) {
  if (value === undefined || value === null || value === '') {
    throw buildCaiError(`El campo ${fieldName} es obligatorio.`);
  }

  const raw = String(value).trim();

  if (!/^\d+$/.test(raw)) {
    throw buildCaiError(`El campo ${fieldName} debe ser un numero entero positivo.`);
  }

  return BigInt(raw);
}

export function validateCreateCaiInput(body = {}) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw buildCaiError('Body invalido para crear CAI.');
  }

  const codigo = body.codigo ? String(body.codigo).trim() : '';
  if (!codigo) {
    throw buildCaiError('El codigo del CAI es obligatorio.');
  }

  const tipoDocumentoId = parseBigIntOrThrow(
    body.tipoDocumentoId ?? body.id_tipo_documento,
    'tipoDocumentoId',
  );
  const fechaInicio = parseDateOrThrow(body.fechaInicio, 'fechaInicio');
  const fechaFin = parseDateOrThrow(body.fechaFin, 'fechaFin');

  if (fechaInicio > fechaFin) {
    throw buildCaiError('La fecha de vencimiento no puede ser menor a la fecha de inicio.');
  }

  const inicioRango = parseBigIntOrThrow(body.inicioRango, 'inicioRango');
  const finalRango = parseBigIntOrThrow(body.finalRango, 'finalRango');

  if (inicioRango > finalRango) {
    throw buildCaiError('El rango final no puede ser menor al rango inicial.');
  }

  return {
    codigo,
    tipoDocumentoId,
    fechaInicio,
    fechaFin,
    inicioRango,
    finalRango,
  };
}
