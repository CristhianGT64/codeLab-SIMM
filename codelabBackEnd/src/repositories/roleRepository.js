import prisma from "../infra/prisma/prismaClient.js";

export const createRole = async (data) => {

  return prisma.rol.create({
    data
  });

};


export const getAllRoles = async () => {

  return prisma.rol.findMany({
    where: { disponible: true }
  });

};


export const updateRole = async (id, data) => {

  return prisma.rol.update({
    where: { id },
    data
  });

};


export const deleteRole = async (id) => {

  return prisma.rol.update({
    where: { id },
    data: { disponible: false }
  });

};


export const countUsersByRole = async (roleId) => {

  return prisma.usuario.count({
    where: { rolId: roleId }
  });

};


export const assignPermissionsToRole = async (roleId, permissions) => {

  return prisma.rolPermiso.createMany({
    data: permissions.map(permissionId => ({
      rolId: roleId,
      permisoId: permissionId
    })),
    skipDuplicates: true
  });

};


export const updateRolePermissions = async (roleId, permissions) => {

  await prisma.rolPermiso.deleteMany({
    where: { rolId: roleId }
  });

  return prisma.rolPermiso.createMany({
    data: permissions.map(permissionId => ({
      rolId: roleId,
      permisoId: permissionId
    }))
  });

};


export const getRolePermissions = async (roleId) => {

  return prisma.rolPermiso.findMany({
    where: { rolId: roleId },
    include: {
      permiso: true
    }
  });

};