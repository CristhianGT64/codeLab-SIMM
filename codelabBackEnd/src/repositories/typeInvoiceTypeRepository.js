import prisma from '../infra/prisma/prismaClient.js';

const invoiceTypeRepository = {

  create(data) {
    return prisma.tipoDocumento.create({
      data
    });
  },

  getAll() {
    return prisma.tipoDocumento.findMany({
      orderBy: {
        numero: 'asc'
      }
    });
  },

  getById(id) {
    return prisma.tipoDocumento.findUnique({
      where: {
        id: BigInt(id)
      }
    });
  },

  update(id, data) {
    return prisma.tipoDocumento.update({
      where: {
        id: BigInt(id)
      },
      data
    });
  },

  updateStatus(id, disponible) {
    return prisma.tipoDocumento.update({
      where: {
        id: BigInt(id)
      },
      data: {
        disponible
      }
    });
  }

};

export default invoiceTypeRepository;