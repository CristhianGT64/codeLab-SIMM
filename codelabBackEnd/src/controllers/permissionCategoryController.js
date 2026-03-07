import * as service from "../services/permissionCategoryService.js";

export const create = async (req, res) => {

  try {

    const category = await service.createPermissionCategory(req.body);

    res.json(category);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

export const getAll = async (req, res) => {

  try {

    const categories = await service.getAllPermissionCategories();

    res.json(categories);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};