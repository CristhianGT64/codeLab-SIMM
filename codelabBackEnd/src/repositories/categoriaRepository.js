import prisma from '../infra/prisma/prismaClient.js';

const categoriaRepository = {
  list() {
    return prisma.categoria.findMany({
      orderBy: { nombre: 'asc' },
      select: { id: true, nombre: true, descripcion: true, disponible: true },
    });
  },

  findById(id) {
    return prisma.categoria.findUnique({
      where: { id },
      select: { id: true, nombre: true, descripcion: true, disponible: true },
    });
  },

  findByNombre(nombre) {
    return prisma.categoria.findFirst({
      where: { nombre },
      select: { id: true },
    });
  },

  create(data) {
    return prisma.categoria.create({
      data,
      select: { id: true, nombre: true, descripcion: true, disponible: true },
    });
  },

  update(id, data) {
    return prisma.categoria.update({
      where: { id },
      data,
      select: { id: true, nombre: true, descripcion: true, disponible: true },
    });
  },
};

export default categoriaRepository;