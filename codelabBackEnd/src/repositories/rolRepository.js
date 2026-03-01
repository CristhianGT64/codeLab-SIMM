import prisma from '../infra/prisma/prismaClient.js';

const rolRepository = {
  getAll() {
    return prisma.rol.findMany({
      orderBy: { id: 'asc' },
      select: { id: true, nombre: true, descripcion: true, disponible: true },
    });
  },

  create(data) {
    return prisma.rol.create({
      data,
      select: { id: true, nombre: true, descripcion: true, disponible: true },
    });
  },

  findById(id) {
    return prisma.rol.findUnique({
      where: { id },
      select: { id: true },
    });
  },
};

export default rolRepository;