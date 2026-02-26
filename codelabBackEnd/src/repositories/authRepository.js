import prisma from '../infra/prisma/prismaClient.js';

const authRepository = {
  findUserForLogin(login) {
    return prisma.usuario.findFirst({
      where: {
        eliminado: false,
        estado: 'activo',
        OR: [{ correo: login }, { usuario: login }],
      },
      select: {
        id: true,
        nombreCompleto: true,
        correo: true,
        usuario: true,
        password: true,
        estado: true,
        eliminado: true,
        rol: { select: { id: true, nombre: true } },
        sucursal: { select: { id: true, nombre: true } },
      },
    });
  },
};

export default authRepository;