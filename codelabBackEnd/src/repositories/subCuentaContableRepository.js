import prisma from '../infra/prisma/prismaClient.js';

const subCuentaContableSelect = {
  id: true,
  uuidSubCuentaContable: true,
  nombre: true,
  disponible: true,
  codigoNumerico: true,
  uuidElementoContable: true,
  uuidClasificacionContable: true,
  uuidCuentaContable: true,
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
  cuentaContable: {
    select: {
      id: true,
      uuidCuentaContable: true,
      nombre: true,
      codigoNumerico: true,
      disponible: true,
    },
  },
  naturaleza: {
    select: {
      id: true,
      uuidNaturaleza: true,
      nombre: true,
      disponible: true,
    },
  },
};

const subCuentaContableRepository = {
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

    if (filters.uuidCuentaContable) {
      where.uuidCuentaContable = filters.uuidCuentaContable;
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

    return prisma.subCuentaContable.findMany({
      where,
      orderBy: [
        { elementoContable: { codigoNumerico: 'asc' } },
        { clasificacionContable: { codigoNumerico: 'asc' } },
        { cuentaContable: { codigoNumerico: 'asc' } },
        { codigoNumerico: 'asc' },
        { nombre: 'asc' },
      ],
      select: subCuentaContableSelect,
    });
  },

  findById(id) {
    return prisma.subCuentaContable.findUnique({
      where: { id },
      select: subCuentaContableSelect,
    });
  },

  findByUuid(uuidSubCuentaContable) {
    return prisma.subCuentaContable.findUnique({
      where: { uuidSubCuentaContable },
      select: subCuentaContableSelect,
    });
  },

  findByCuentaAndCodigo(uuidCuentaContable, codigoNumerico) {
    return prisma.subCuentaContable.findFirst({
      where: {
        uuidCuentaContable,
        codigoNumerico,
      },
      select: {
        id: true,
        uuidSubCuentaContable: true,
        codigoNumerico: true,
        nombre: true,
        uuidCuentaContable: true,
      },
    });
  },

  create(data) {
    return prisma.subCuentaContable.create({
      data,
      select: subCuentaContableSelect,
    });
  },

  update(id, data) {
    return prisma.subCuentaContable.update({
      where: { id },
      data,
      select: subCuentaContableSelect,
    });
  },

  count() {
    return prisma.subCuentaContable.count();
  },
};

export default subCuentaContableRepository;