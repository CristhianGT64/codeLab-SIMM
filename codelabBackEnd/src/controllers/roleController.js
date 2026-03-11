import * as service from "../services/roleService.js";

export const create = async (req, res) => {

  try {

    const role = await service.createRole(req.body);

    res.json({
      success: true,
      data: role
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

    const roles = await service.getAllRoles();

    res.json({
      success: true,
      data: roles
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const getById = async (req, res) => {

  try {

    const role = await service.getRoleById(Number(req.params.id));

    res.json({
      success: true,
      data: role
    });

  } catch (error) {

    if (error.message === "Role not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const update = async (req, res) => {

  try {

    const role = await service.updateRole(
      Number(req.params.id),
      req.body
    );

    res.json({
      success: true,
      data: role
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

    await service.deleteRole(Number(req.params.id));

    res.json({
      success: true,
      message: "Role removed"
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

export const assignPermissions = async (req, res) => {

  try {

    const role = await service.assignPermissions(
      Number(req.params.id),
      req.body.permissions
    );

    res.json({
      success: true,
      data: role
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const updatePermissions = async (req, res) => {

  try {

    const result = await service.updatePermissions(
      Number(req.params.id),
      req.body.permissions
    );

    res.json({
      success: true,
      data: result
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const getPermissions = async (req, res) => {

  try {

    const permissions = await service.getRolePermissions(
      Number(req.params.id)
    );

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