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
  detalles: true
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

  async findAll() {
    return prisma.asientoContable.findMany({
      select: asientoSelect,
      orderBy: { id: "desc" }
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