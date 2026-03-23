import prisma from '../infra/prisma/prismaClient.js';

const proveedorRepository = {
  create(data) {
    return prisma.proveedor.create({
      data,
      select: {
        id: true,
        nombre: true,
        telefono: true,
        correo: true,
        direccion: true,
        disponible: true,
      },
    });
  },

  findAll() {
    return prisma.proveedor.findMany({
      orderBy: { id: 'desc' },
      select: {
        id: true,
        nombre: true,
        telefono: true,
        correo: true,
        direccion: true,
        disponible: true,
      },
    });
  },

  findById(id) {
    return prisma.proveedor.findUnique({
      where: { id: BigInt(id) },
      select: {
        id: true,
        nombre: true,
        telefono: true,
        correo: true,
        direccion: true,
        disponible: true,
      },
    });
  },

  findByNombre(nombre) {
    return prisma.proveedor.findFirst({
      where: {
        nombre: {
          equals: nombre,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        nombre: true,
        telefono: true,
        correo: true,
        direccion: true,
        disponible: true,
      },
    });
  },

  update(id, data) {
    return prisma.proveedor.update({
      where: { id: BigInt(id) },
      data,
      select: {
        id: true,
        nombre: true,
        telefono: true,
        correo: true,
        direccion: true,
        disponible: true,
      },
    });
  },
};

export default proveedorRepository;