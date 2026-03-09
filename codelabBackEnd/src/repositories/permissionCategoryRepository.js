import prisma from "../infra/prisma/prismaClient.js";

export const createPermissionCategory = async (data) => {

  return prisma.categoriaPermiso.create({
    data
  });

};

export const getAllPermissionCategories = async () => {

  return prisma.categoriaPermiso.findMany({
    where: { disponible: true },
    include: {
      permisos: {
        where: { disponible: true }
      }
    }
  });

};

export const updatePermissionCategory = async (id, data) => {

  return prisma.categoriaPermiso.update({
    where: { id },
    data
  });

};

export const deletePermissionCategory = async (id) => {

  return prisma.categoriaPermiso.update({
    where: { id },
    data: { disponible: false }
  });

};
