import * as service from "../services/permissionService.js";

export const create = async (req, res) => {

  try {

    const permission = await service.createPermission(req.body);

    res.json({
      success: true,
      data: permission
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

    const permissions = await service.getAllPermissions();

    res.json({
      success: true,
      data: permissions
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const update = async (req, res) => {

  try {

    const permission = await service.updatePermission(
      Number(req.params.id),
      req.body
    );

    res.json({
      success: true,
      data: permission
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const remove = async (req, res) => {

  try {

    await service.deletePermission(Number(req.params.id));

    res.json({
      success: true,
      message: "Permission removed"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};