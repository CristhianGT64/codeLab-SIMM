import prisma from '../infra/prisma/prismaClient.js';

const cuentaContableSelect = {
  id: true,
  uuidCuentaContable: true,
  nombre: true,
  disponible: true,
  codigoNumerico: true,
  uuidElementoContable: true,
  uuidClasificacionContable: true,
  idNaturaleza: true,
  elementoContable: {
    select: {
      id: true,
      uuidElementoContable: true,
      nombre: true,
      codigoNumerico: true,
      disponible: true,
    },
  },
  clasificacionContable: {
    select: {
      id: true,
      uuidClasificacionContable: true,
      nombre: true,
      codigoNumerico: true,
      disponible: true,
    },
  },
};

const cuentaContableRepository = {
  list(filters = {}) {
    const where = {};

    if (typeof filters.disponible === 'boolean') {
      where.disponible = filters.disponible;
    }

    if (filters.uuidElementoContable) {
      where.uuidElementoContable = filters.uuidElementoContable;
    }

    if (filters.uuidClasificacionContable) {
      where.uuidClasificacionContable = filters.uuidClasificacionContable;
    }

    if (filters.search) {
      where.OR = [
        { nombre: { contains: filters.search, mode: 'insensitive' } },
      ];

      const parsedCodigo = Number(filters.search);
      if (!Number.isNaN(parsedCodigo)) {
        where.OR.push({ codigoNumerico: parsedCodigo });
      }
    }

    return prisma.cuentaContable.findMany({
      where,
      orderBy: [
        { elementoContable: { codigoNumerico: 'asc' } },
        { clasificacionContable: { codigoNumerico: 'asc' } },
        { codigoNumerico: 'asc' },
        { nombre: 'asc' },
      ],
      select: cuentaContableSelect,
    });
  },

  findById(id) {
    return prisma.cuentaContable.findUnique({
      where: { id },
      select: cuentaContableSelect,
    });
  },

  findByUuid(uuidCuentaContable) {
    return prisma.cuentaContable.findUnique({
      where: { uuidCuentaContable },
      select: cuentaContableSelect,
    });
  },

  findByClasificacionAndCodigo(uuidClasificacionContable, codigoNumerico) {
    return prisma.cuentaContable.findFirst({
      where: {
        uuidClasificacionContable,
        codigoNumerico,
      },
      select: {
        id: true,
        uuidCuentaContable: true,
        codigoNumerico: true,
        nombre: true,
        uuidClasificacionContable: true,
      },
    });
  },

  create(data) {
    return prisma.cuentaContable.create({
      data,
      select: cuentaContableSelect,
    });
  },

  update(id, data) {
    return prisma.cuentaContable.update({
      where: { id },
      data,
      select: cuentaContableSelect,
    });
  },

  count() {
    return prisma.cuentaContable.count();
  },
};

export default cuentaContableRepository;