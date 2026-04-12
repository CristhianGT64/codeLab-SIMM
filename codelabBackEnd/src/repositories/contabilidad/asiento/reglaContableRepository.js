import prisma from "../../../infra/prisma/prismaClient.js";

const reglaSelect = {
  id: true,
  tipoOperacion: true,
  descripcion: true,
  subCuentaDebeId: true,
  subCuentaHaberId: true,
  subCuentaImpuestoId: true,
  disponible: true
};

const reglaContableRepository = {

  async findByOperacion(tipoOperacion) {
    return prisma.reglaContable.findMany({
      where: {
        tipoOperacion,
        disponible: true
      },
      select: reglaSelect
    });
  },

  async findAll() {
    return prisma.reglaContable.findMany({
      select: reglaSelect
    });
  },

  async findById(id) {
    return prisma.reglaContable.findUnique({
      where: { id },
      select: reglaSelect
    });
  },

  async create(data) {
    return prisma.reglaContable.create({
      data,
      select: reglaSelect
    });
  },

  async update(id, data) {
    return prisma.reglaContable.update({
      where: { id },
      data,
      select: reglaSelect
    });
  }

};

export default reglaContableRepository;