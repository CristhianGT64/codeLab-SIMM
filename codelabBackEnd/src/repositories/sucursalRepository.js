import prisma from '../infra/prisma/prismaClient.js';

const sucursalRepository = {
  getAll() {
    return prisma.sucursal.findMany({
      orderBy: { id: 'asc' },
      select: { id: true, nombre: true, direccion: true, telefono: true, activa: true },
    });
  },

  create(data) {
    return prisma.sucursal.create({
      data,
      select: { id: true, nombre: true, direccion: true, telefono: true, activa: true },
    });
  },

  findById(id) {
    return prisma.sucursal.findUnique({
      where: { id },
      select: { id: true },
    });
  },
};

export default sucursalRepository;