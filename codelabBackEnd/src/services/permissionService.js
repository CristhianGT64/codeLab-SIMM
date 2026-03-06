import * as repository from "../repositories/permissionRepository.js";

export const createPermission = async (data) => {

  return repository.createPermission(data);

};

export const getAllPermissions = async () => {

  return repository.getAllPermissions();

};

export const getPermissionById = async (id) => {

  return repository.getPermissionById(id);

};

export const updatePermission = async (id, data) => {

  return repository.updatePermission(id, data);

};

export const deletePermission = async (id) => {

  return repository.deletePermission(id);

};