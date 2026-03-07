import prisma from "../../infra/prisma/prismaClient.js";

export const authorizePermission = (permissionName) => {

  return async (req, res, next) => {

    try {

      const userId = req.user.id;

      const user = await prisma.usuario.findUnique({

        where: { id: userId },

        include: {
          rol: {
            include: {
              rolPermisos: {
                include: {
                  permiso: true
                }
              }
            }
          }
        }

      });

      const permissions = user.rol.rolPermisos.map(
        (rp) => rp.permiso.nombre
      );

      if (!permissions.includes(permissionName)) {

        return res.status(403).json({
          message: "Permission denied"
        });

      }

      next();

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  };

};