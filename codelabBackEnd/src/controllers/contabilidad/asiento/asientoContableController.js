import asientoContableService from "../../../services/contabilidad/asiento/asientoContableService.js";

const getFiltersFromQuery = (query = {}) => ({
  ...(query.fechaInicio ? { fechaInicio: String(query.fechaInicio) } : {}),
  ...(query.fechaFin ? { fechaFin: String(query.fechaFin) } : {}),
});

const asientoContableController = {

  async list(req, res, next) {
    try {
      const filters = getFiltersFromQuery(req.query);
      const data = await asientoContableService.list(filters);

      res.json({
        success: true,
        data
      });

    } catch (e) {
      next(e);
    }
  },

  async export(req, res, next) {
    try {
      const filters = getFiltersFromQuery(req.query);
      const data = await asientoContableService.list(filters);
      const pdfBuffer = asientoContableService.buildPdf(data, filters);
      const today = new Date().toISOString().slice(0, 10);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="libro-diario-${today}.pdf"`,
      );
      res.setHeader("Content-Length", pdfBuffer.length);
      res.send(pdfBuffer);
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
