import * as repository from "../repositories/roleRepository.js";

export const createRole = async (data) => {

  return repository.createRole(data);

};

export const getAllRoles = async () => {

  return repository.getAllRoles();

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