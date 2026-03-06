import * as repository from "../repositories/permissionCategoryRepository.js";

export const createPermissionCategory = async (data) => {

  return repository.createPermissionCategory(data);

};

export const getAllPermissionCategories = async () => {

  return repository.getAllPermissionCategories();

};

export const updatePermissionCategory = async (id, data) => {

  return repository.updatePermissionCategory(id, data);

};

export const deletePermissionCategory = async (id) => {

  return repository.deletePermissionCategory(id);

};