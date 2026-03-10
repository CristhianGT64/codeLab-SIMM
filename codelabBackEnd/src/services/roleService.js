import * as repository from "../repositories/roleRepository.js";

export const createRole = async (data) => {

  return repository.createRole(data);

};

export const getAllRoles = async () => {

  const roles = await repository.getAllRoles();
  
  return roles.map(r => ({
    id: r.id,
    nombre: r.nombre,
    descripcion: r.descripcion,
    disponible: r.disponible,
    createdAt: r.createdAt,
    totalUsuariosRol: r._count.usuarios,
    totalPermisosRol: r._count.rolPermisos
  }));

};

export const getRoleById = async (id) => {

  const role = await repository.getRoleById(id);

  if (!role) {
    throw new Error("Role not found");
  }

  return {
    id: role.id,
    nombre: role.nombre,
    descripcion: role.descripcion,
    permisos: role.rolPermisos.map((rolePermission) => rolePermission.permiso)
  };

};

export const updateRole = async (id, data) => {

  return repository.updateRole(id, data);

};

export const deleteRole = async (id) => {

  const users = await repository.countUsersByRole(id);

  if (users > 0) {
    throw new Error("Role has assigned users");
  }

  return repository.deleteRole(id);

};


// asignar permisos (agrega)

export const assignPermissions = async (roleId, permissions) => {

  return repository.assignPermissionsToRole(roleId, permissions);

};


// modificar permisos (reemplaza)

export const updatePermissions = async (roleId, permissions) => {

  return repository.updateRolePermissions(roleId, permissions);

};


export const getRolePermissions = async (roleId) => {

  return repository.getRolePermissions(roleId);

};