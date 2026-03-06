import prisma from '../infra/prisma/prismaClient.js';

const authRepository = {
  findUserForLogin(login) {
    return prisma.usuario.findFirst({
      where: {
        eliminado: false,
        estado: 'activo',
        OR: [{ correo: login }, { usuario: login }],
      },
      include: {
        rol: {
          include: {
            rolPermisos: {
              include: {
                permiso: true
              }
            }
          }
        },
        sucursal: {
          select: { id: true, nombre: true }
        }
      }
    });
  },
};

export default authRepository;