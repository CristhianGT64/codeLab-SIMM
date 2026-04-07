import reglaContableService from "../../../services/contabilidad/asiento/reglaContableService.js";

const reglaContableController = {

  async list(req, res, next) {
    try {
      const data = await reglaContableService.list();
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      const data = await reglaContableService.create(req.body);

      res.status(201).json({
        success: true,
        message: "Regla contable creada",
        data
      });

    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const data = await reglaContableService.update(req.params.id, req.body);

      res.json({
        success: true,
        message: "Regla contable actualizada",
        data
      });

    } catch (e) {
      next(e);
    }
  }

};

export default reglaContableController;