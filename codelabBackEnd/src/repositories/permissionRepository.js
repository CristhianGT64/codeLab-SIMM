import prisma from "../infra/prisma/prismaClient.js";

export const createPermission = async (data) => {

  return prisma.permiso.create({
    data
  });

};

export const getAllPermissions = async () => {

  return prisma.permiso.findMany({
    include: {
      categoria: true
    }
  });

};

export const getPermissionById = async (id) => {

  return prisma.permiso.findUnique({
    where: { id }
  });

};

export const updatePermission = async (id, data) => {

  return prisma.permiso.update({
    where: { id },
    data
  });

};

export const deletePermission = async (id) => {

  return prisma.permiso.update({
    where: { id },
    data: { disponible: false }
  });

};