import * as service from "../services/permissionCategoryService.js";

export const create = async (req, res) => {

  try {

    const category = await service.createPermissionCategory(req.body);

    res.json({
      success: true,
      data: category
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const getAll = async (req, res) => {

  try {

    const categories = await service.getAllPermissionCategories();

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};