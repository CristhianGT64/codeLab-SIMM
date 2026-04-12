import ajustesInventarioReportService from '../../services/reportes/ajustesInventarioReportService.js';

const getFiltersFromQuery = (query = {}) => ({
  ...(query.productoId ? { productoId: String(query.productoId) } : {}),
  ...(query.fechaInicio ? { fechaInicio: String(query.fechaInicio) } : {}),
  ...(query.fechaFin ? { fechaFin: String(query.fechaFin) } : {}),
  ...(query.tipoAjuste ? { tipoAjuste: String(query.tipoAjuste) } : {}),
});

const ajustesInventarioReportController = {
  async list(req, res, next) {
    try {
      const filters = getFiltersFromQuery(req.query);
      const data = await ajustesInventarioReportService.list(filters);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async exportPdf(req, res, next) {
    try {
      const filters = getFiltersFromQuery(req.query);
      const data = await ajustesInventarioReportService.list(filters);
      const pdfBuffer = ajustesInventarioReportService.buildPdf(data);
      const today = new Date().toISOString().slice(0, 10);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="ajustes-inventario-${today}.pdf"`,
      );
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  },
};

export default ajustesInventarioReportController;
