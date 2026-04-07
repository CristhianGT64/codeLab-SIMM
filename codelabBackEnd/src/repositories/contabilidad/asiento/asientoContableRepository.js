import prisma from "../../../infra/prisma/prismaClient.js";

const asientoSelect = {
  id: true,
  uuidAsientoContable: true,
  numeroAsiento: true,
  descripcion: true,
  tipoOperacion: true,
  idOperacionOrigen: true,
  totalDebe: true,
  totalHaber: true,
  balanceado: true,
  fecha: true,
  detalles: {
    orderBy: {
      orden: "asc"
    },
    select: {
      id: true,
      uuidDetalle: true,
      asientoId: true,
      subCuentaContableId: true,
      montoDebe: true,
      montoHaber: true,
      descripcion: true,
      orden: true,
      subCuentaContable: {
        select: {
          id: true,
          nombre: true,
          codigoNumerico: true,
          elementoContable: {
            select: {
              codigoNumerico: true
            }
          },
          clasificacionContable: {
            select: {
              codigoNumerico: true
            }
          },
          cuentaContable: {
            select: {
              nombre: true,
              codigoNumerico: true
            }
          }
        }
      }
    }
  }
};

const asientoContableRepository = {

  async findLastNumero() {
    return prisma.asientoContable.findFirst({
      orderBy: { id: "desc" },
      select: { numeroAsiento: true }
    });
  },

  async create(asiento, detalles, tx = prisma) {

    return tx.asientoContable.create({
      data: {
        ...asiento,
        detalles: {
          create: detalles
        }
      },
      select: asientoSelect
    });

  },

  async findAll(filters = {}) {
    const where = {};

    if (filters.fechaInicio || filters.fechaFin) {
      where.fecha = {};

      if (filters.fechaInicio) {
        where.fecha.gte = filters.fechaInicio;
      }

      if (filters.fechaFin) {
        where.fecha.lte = filters.fechaFin;
      }
    }

    return prisma.asientoContable.findMany({
      where,
      select: asientoSelect,
      orderBy: [
        { fecha: "asc" },
        { id: "asc" }
      ]
    });
  },

  async findById(id) {
    return prisma.asientoContable.findUnique({
      where: { id },
      select: asientoSelect
    });
  }

};

export default asientoContableRepository;
