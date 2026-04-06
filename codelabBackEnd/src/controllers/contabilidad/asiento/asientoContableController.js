import asientoContableService from "../../../services/contabilidad/asiento/asientoContableService.js";

const asientoContableController = {

  async list(req, res, next) {
    try {

      const data = await asientoContableService.list();

      res.json({
        success: true,
        data
      });

    } catch (e) {
      next(e);
    }
  },

  async getById(req, res, next) {
    try {

      const data = await asientoContableService.getById(req.params.id);

      res.json({
        success: true,
        data
      });

    } catch (e) {
      next(e);
    }
  }

};

export default asientoContableController;