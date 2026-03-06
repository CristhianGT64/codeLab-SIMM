import * as service from "../services/roleService.js";

export const create = async (req, res) => {

  try {

    const role = await service.createRole(req.body);

    res.json(role);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


export const getAll = async (req, res) => {

  try {

    const roles = await service.getAllRoles();

    res.json(roles);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


export const update = async (req, res) => {

  try {

    const role = await service.updateRole(
      Number(req.params.id),
      req.body
    );

    res.json(role);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


export const remove = async (req, res) => {

  try {

    await service.deleteRole(Number(req.params.id));

    res.json({ message: "Role removed" });

  } catch (error) {

    res.status(400).json({ message: error.message });

  }

};


// asignar permisos (POST /roles/:id/permissions)

export const assignPermissions = async (req, res) => {

  try {

    const role = await service.assignPermissions(
      Number(req.params.id),
      req.body.permissions
    );

    res.json(role);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


// modificar permisos (PUT /roles/:id/permissions)

export const updatePermissions = async (req, res) => {

  try {

    const result = await service.updatePermissions(
      Number(req.params.id),
      req.body.permissions
    );

    res.json({ message: "Permissions updated", result });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


export const getPermissions = async (req, res) => {

  try {

    const permissions = await service.getRolePermissions(
      Number(req.params.id)
    );

    res.json(permissions);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};
