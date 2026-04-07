import periodoContableService from '../services/periodoContableService.js';

const serializePeriodo = (periodo) => ({
  id: String(periodo.id),
  sucursalId: String(periodo.sucursalId),
  sucursalNombre: periodo.sucursal?.nombre ?? 'Sucursal no disponible',
  fechaInicio: periodo.fechaInicio,
  fechaFin: periodo.fechaFin,
  estado: periodo.estado,
  fechaCierre: periodo.fechaCierre,
  usuarioCierreId: periodo.usuarioCierreId ? String(periodo.usuarioCierreId) : null,
  usuarioCierreNombre: periodo.usuarioCierre?.nombreCompleto || periodo.usuarioCierre?.usuario || null,
  activo: Boolean(periodo.activo),
  periodoClave: periodo.periodoClave || '',
});

const getFiltersFromQuery = (query = {}) => ({
  sucursalId: query.sucursalId,
  estado: query.estado,
  fechaInicio: query.fechaInicio,
  fechaFin: query.fechaFin,
});

const periodoContableController = {
  async list(req, res, next) {
    try {
      const data = await periodoContableService.list(getFiltersFromQuery(req.query));

      res.json({
        success: true,
        data: data.map(serializePeriodo),
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const data = await periodoContableService.getById(req.params.id);

      res.json({
        success: true,
        data: serializePeriodo(data),
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const data = await periodoContableService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Periodo contable creado correctamente.',
        data: serializePeriodo(data),
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const data = await periodoContableService.update(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Periodo contable actualizado correctamente.',
        data: serializePeriodo(data),
      });
    } catch (error) {
      next(error);
    }
  },

  async cerrar(req, res, next) {
    try {
      const data = await periodoContableService.cerrar(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Periodo contable cerrado correctamente.',
        data: serializePeriodo(data),
      });
    } catch (error) {
      next(error);
    }
  },
};

export default periodoContableController;
