import prisma from '../infra/prisma/prismaClient.js';
import periodoContableRepository from '../repositories/periodoContableRepository.js';

const ROLES_CIERRE_PERMITIDOS = new Set(['administrador', 'contador']);

const buildError = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const normalizeText = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const parseId = (value, fieldName, { required = false } = {}) => {
  if (value === undefined || value === null || value === '') {
    if (required) {
      throw buildError(`${fieldName} es requerido.`);
    }

    return undefined;
  }

  if (!/^\d+$/.test(String(value))) {
    throw buildError(`${fieldName} es invalido.`);
  }

  return BigInt(value);
};

const parseDate = (value, fieldName, { endOfDay = false, required = false } = {}) => {
  if (value === undefined || value === null || value === '') {
    if (required) {
      throw buildError(`${fieldName} es requerido.`);
    }

    return undefined;
  }

  const normalized = new Date(
    `${String(value).trim().slice(0, 10)}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}`,
  );

  if (Number.isNaN(normalized.getTime())) {
    throw buildError(`${fieldName} es invalida.`);
  }

  return normalized;
};

const isPeriodoActivo = (periodo) => {
  const now = new Date();

  return (
    periodo?.estado === 'ABIERTO'
    && now >= new Date(periodo.fechaInicio)
    && now <= new Date(periodo.fechaFin)
  );
};

const assertDateRange = (fechaInicio, fechaFin) => {
  if (fechaInicio > fechaFin) {
    throw buildError('fechaInicio no puede ser mayor que fechaFin.');
  }
};

const ensureSucursalExists = async (sucursalId, tx = prisma) => {
  const sucursal = await tx.sucursal.findUnique({
    where: {
      id: BigInt(sucursalId),
    },
    select: {
      id: true,
      nombre: true,
      activa: true,
    },
  });

  if (!sucursal) {
    throw buildError('Sucursal no encontrada.', 404);
  }

  return sucursal;
};

const ensureUsuarioCierreValido = async (usuarioCierreId, tx = prisma) => {
  const usuario = await tx.usuario.findUnique({
    where: {
      id: BigInt(usuarioCierreId),
    },
    select: {
      id: true,
      nombreCompleto: true,
      usuario: true,
      rol: {
        select: {
          id: true,
          nombre: true,
        },
      },
    },
  });

  if (!usuario) {
    throw buildError('Usuario de cierre no encontrado.', 404);
  }

  const roleName = normalizeText(usuario.rol?.nombre);

  if (!ROLES_CIERRE_PERMITIDOS.has(roleName)) {
    throw buildError('Solo administrador o contador pueden cerrar el periodo contable.', 403);
  }

  return usuario;
};

const mapPeriodoForResponse = (periodo) => ({
  ...periodo,
  activo: isPeriodoActivo(periodo),
  periodoClave:
    periodo.fechaInicio instanceof Date
    && periodo.fechaFin instanceof Date
    && periodo.fechaInicio.getUTCDate() === 1
    && periodo.fechaFin.getUTCDate() >= 28
    && periodo.fechaInicio.getUTCMonth() === periodo.fechaFin.getUTCMonth()
    && periodo.fechaInicio.getUTCFullYear() === periodo.fechaFin.getUTCFullYear()
      ? `${periodo.fechaInicio.getUTCFullYear()}-${String(periodo.fechaInicio.getUTCMonth() + 1).padStart(2, '0')}`
      : '',
});

const periodoContableService = {
  async list(filters = {}) {
    const normalizedFilters = {
      sucursalId: filters.sucursalId ? parseId(filters.sucursalId, 'sucursalId') : undefined,
      estado: filters.estado ? String(filters.estado).trim().toUpperCase() : undefined,
      fechaInicio: filters.fechaInicio ? parseDate(filters.fechaInicio, 'fechaInicio') : undefined,
      fechaFin: filters.fechaFin ? parseDate(filters.fechaFin, 'fechaFin', { endOfDay: true }) : undefined,
    };

    if (
      normalizedFilters.fechaInicio
      && normalizedFilters.fechaFin
      && normalizedFilters.fechaInicio > normalizedFilters.fechaFin
    ) {
      throw buildError('fechaInicio no puede ser mayor que fechaFin.');
    }

    const data = await periodoContableRepository.findAll(normalizedFilters);
    return data.map(mapPeriodoForResponse);
  },

  async getById(id) {
    const normalizedId = parseId(id, 'id', { required: true });
    const periodo = await periodoContableRepository.findById(normalizedId);

    if (!periodo) {
      throw buildError('Periodo contable no encontrado.', 404);
    }

    return mapPeriodoForResponse(periodo);
  },

  async create(body = {}) {
    const sucursalId = parseId(body.sucursalId, 'sucursalId', { required: true });
    const fechaInicio = parseDate(body.fechaInicio, 'fechaInicio', { required: true });
    const fechaFin = parseDate(body.fechaFin, 'fechaFin', { required: true, endOfDay: true });

    assertDateRange(fechaInicio, fechaFin);

    return prisma.$transaction(async (tx) => {
      await ensureSucursalExists(sucursalId, tx);

      const overlapping = await periodoContableRepository.findOverlap({
        sucursalId,
        fechaInicio,
        fechaFin,
      }, tx);

      if (overlapping) {
        throw buildError('Ya existe un periodo contable superpuesto para la sucursal indicada.', 409);
      }

      const periodo = await periodoContableRepository.create({
        sucursalId,
        fechaInicio,
        fechaFin,
        estado: 'ABIERTO',
      }, tx);

      return mapPeriodoForResponse(periodo);
    });
  },

  async update(id, body = {}) {
    const normalizedId = parseId(id, 'id', { required: true });
    const sucursalId = parseId(body.sucursalId, 'sucursalId', { required: true });
    const fechaInicio = parseDate(body.fechaInicio, 'fechaInicio', { required: true });
    const fechaFin = parseDate(body.fechaFin, 'fechaFin', { required: true, endOfDay: true });

    assertDateRange(fechaInicio, fechaFin);

    return prisma.$transaction(async (tx) => {
      const periodoActual = await periodoContableRepository.findById(normalizedId, tx);

      if (!periodoActual) {
        throw buildError('Periodo contable no encontrado.', 404);
      }

      if (periodoActual.estado !== 'ABIERTO') {
        throw buildError('Solo se pueden actualizar periodos contables abiertos.', 409);
      }

      await ensureSucursalExists(sucursalId, tx);

      const overlapping = await periodoContableRepository.findOverlap({
        sucursalId,
        fechaInicio,
        fechaFin,
        excludeId: normalizedId,
      }, tx);

      if (overlapping) {
        throw buildError('Ya existe un periodo contable superpuesto para la sucursal indicada.', 409);
      }

      const periodo = await periodoContableRepository.update(normalizedId, {
        sucursalId,
        fechaInicio,
        fechaFin,
      }, tx);

      return mapPeriodoForResponse(periodo);
    });
  },

  async cerrar(id, body = {}) {
    const normalizedId = parseId(id, 'id', { required: true });
    const usuarioCierreId = parseId(
      body.usuarioCierreId ?? body.usuarioId,
      'usuarioCierreId',
      { required: true },
    );

    return prisma.$transaction(async (tx) => {
      const periodo = await periodoContableRepository.findById(normalizedId, tx);

      if (!periodo) {
        throw buildError('Periodo contable no encontrado.', 404);
      }

      if (periodo.estado === 'CERRADO') {
        throw buildError('El periodo contable ya se encuentra cerrado.', 409);
      }

      await ensureUsuarioCierreValido(usuarioCierreId, tx);

      const asientos = await periodoContableRepository.findAsientosBySucursalAndRange({
        sucursalId: periodo.sucursalId,
        fechaInicio: periodo.fechaInicio,
        fechaFin: periodo.fechaFin,
      }, tx);

      const invalidAsiento = asientos.find((asiento) => (
        !asiento.balanceado
        || Number(asiento.totalDebe) !== Number(asiento.totalHaber)
      ));

      if (invalidAsiento) {
        throw buildError(
          `No se puede cerrar el periodo porque existe un asiento descuadrado (${invalidAsiento.numeroAsiento}).`,
          409,
        );
      }

      const updated = await periodoContableRepository.update(normalizedId, {
        estado: 'CERRADO',
        fechaCierre: new Date(),
        usuarioCierreId,
      }, tx);

      return mapPeriodoForResponse(updated);
    });
  },

  async assertPeriodoAbierto({ sucursalId, fecha = new Date(), tx = prisma, actionLabel = 'registrar movimientos contables' }) {
    const normalizedSucursalId = parseId(sucursalId, 'sucursalId', { required: true });
    const normalizedFecha = fecha instanceof Date ? fecha : new Date(fecha);

    if (Number.isNaN(normalizedFecha.getTime())) {
      throw buildError('La fecha del movimiento es invalida.');
    }

    await ensureSucursalExists(normalizedSucursalId, tx);

    const periodoAbierto = await periodoContableRepository.findOpenBySucursalAndDate({
      sucursalId: normalizedSucursalId,
      fecha: normalizedFecha,
    }, tx);

    if (periodoAbierto) {
      return mapPeriodoForResponse(periodoAbierto);
    }

    const periodoExistente = await periodoContableRepository.findBySucursalAndDate({
      sucursalId: normalizedSucursalId,
      fecha: normalizedFecha,
    }, tx);

    if (periodoExistente?.estado === 'CERRADO') {
      throw buildError(`No se puede ${actionLabel} porque el periodo contable esta cerrado.`, 409);
    }

    throw buildError(`No se puede ${actionLabel} porque no existe un periodo contable abierto para la fecha indicada.`, 409);
  },
};

export default periodoContableService;
