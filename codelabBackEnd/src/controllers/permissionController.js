import * as service from "../services/permissionService.js";

export const create = async (req, res) => {

  try {

    const permission = await service.createPermission(req.body);

    res.json(permission);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

export const getAll = async (req, res) => {

  try {

    const permissions = await service.getAllPermissions();

    res.json(permissions);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

export const update = async (req, res) => {

  try {

    const permission = await service.updatePermission(
      Number(req.params.id),
      req.body
    );

    res.json(permission);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

export const remove = async (req, res) => {

  try {

    await service.deletePermission(Number(req.params.id));

    res.json({ message: "Permission removed" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};