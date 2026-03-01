import prisma from '../infra/prisma/prismaClient.js';

const usuarioRepository = {
  findActiveByCorreoOrUsuario(correo, usuario) {
    return prisma.usuario.findFirst({
      where: {
        eliminado: false,
        OR: [{ correo }, { usuario }],
      },
      select: { id: true },
    });
  },

  findDeletedByCorreoOrUsuario(correo, usuario) {
    return prisma.usuario.findFirst({
      where: {
        eliminado: true,
        OR: [{ correo }, { usuario }],
      },
      select: { id: true },
    });
  },

  create(data) {
    return prisma.usuario.create({
      data,
      select: {
        id: true,
        nombreCompleto: true,
        correo: true,
        usuario: true,
        estado: true,
        eliminado: true,
        rolId: true,
        sucursalId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  restoreById(id, data) {
    return prisma.usuario.update({
      where: { id },
      data,
      select: {
        id: true,
        nombreCompleto: true,
        correo: true,
        usuario: true,
        estado: true,
        eliminado: true,
        rolId: true,
        sucursalId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  getAllNotDeleted() {
    return prisma.usuario.findMany({
      where: { eliminado: false },
      orderBy: { id: 'desc' },
      select: {
        id: true,
        nombreCompleto: true,
        correo: true,
        usuario: true,
        estado: true,
        rol: { select: { id: true, nombre: true } },
        sucursal: { select: { id: true, nombre: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  getNotDeletedById(id) {
    return prisma.usuario.findFirst({
      where: { id, eliminado: false },
      select: {
        id: true,
        nombreCompleto: true,
        correo: true,
        usuario: true,
        estado: true,
        rol: { select: { id: true, nombre: true } },
        sucursal: { select: { id: true, nombre: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  findNotDeletedById(id) {
    return prisma.usuario.findFirst({
      where: { id, eliminado: false },
      select: { id: true, correo: true, usuario: true },
    });
  },

  findDupActiveNotSelf(id, correo, usuario) {
    return prisma.usuario.findFirst({
      where: {
        eliminado: false,
        id: { not: id },
        OR: [
          ...(correo ? [{ correo }] : []),
          ...(usuario ? [{ usuario }] : []),
        ],
      },
      select: { id: true },
    });
  },

  findDupDeleted(correo, usuario) {
    return prisma.usuario.findFirst({
      where: {
        eliminado: true,
        OR: [
          ...(correo ? [{ correo }] : []),
          ...(usuario ? [{ usuario }] : []),
        ],
      },
      select: { id: true },
    });
  },

  updateById(id, data) {
    return prisma.usuario.update({
      where: { id },
      data,
      select: {
        id: true,
        nombreCompleto: true,
        correo: true,
        usuario: true,
        estado: true,
        eliminado: true,
        rol: { select: { id: true, nombre: true } },
        sucursal: { select: { id: true, nombre: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  updateEstadoById(id, estado) {
    return prisma.usuario.update({
      where: { id },
      data: { estado },
      select: {
        id: true,
        nombreCompleto: true,
        correo: true,
        usuario: true,
        estado: true,
        eliminado: true,
        rol: { select: { id: true, nombre: true } },
        sucursal: { select: { id: true, nombre: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  softDelete(id) {
    return prisma.usuario.update({
      where: { id },
      data: { eliminado: true, estado: 'inactivo' },
      select: { id: true },
    });
  },
};

export default usuarioRepository;