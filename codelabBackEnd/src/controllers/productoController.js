import productoService from '../services/productoService.js';

const productoController = {
  async create(req, res, next) {
    try {
      const imagenPath = req.file ? `/uploads/productos/${req.file.filename}` : null;

      const payload = {
        ...req.body,
        imagenPath,
      };

      const data = await productoService.create(payload);

      res.status(201).json({
        success: true,
        message: 'Producto guardado correctamente.',
        data,
      });
    } catch (e) {
      if (e?.code === 'P2002') {
        return res.status(409).json({
          success: false,
          message: 'SKU duplicado.',
        });
      }
      next(e);
    }
  },

  async list(req, res, next) {
    try {
      const data = await productoService.list();
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async getById(req, res, next) {
    try {
      const data = await productoService.getById(req.params.id);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },
  // Búsqueda de productos por nombre o SKU (query)
  async search(req, res, next) {

    try {

      const result = await productoService.searchProducts(req.query.q);

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      next(error);
    }

  },
  async update(req, res, next) {
    try {
      const imagenPath = req.file ? `/uploads/productos/${req.file.filename}` : undefined;
      const payload = {
        ...(req.body || {}),
        ...(imagenPath !== undefined ? { imagenPath } : {}),
      };

      const data = await productoService.update(req.params.id, payload);
      res.json({
        success: true,
        message: 'Producto actualizado correctamente.',
        data,
      });
    } catch (e) {
      if (e?.code === 'P2002') {
        return res.status(409).json({
          success: false,
          message: 'SKU duplicado.',
        });
      }
      next(e);
    }
  },

  async updateStockMinimo(req, res, next) {
    try {
      const data = await productoService.updateStockMinimo(
        req.params.id,
        req.body?.stockMinimo
      );

      res.json({
        success: true,
        message: 'Stock mínimo actualizado correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async patch(req, res, next) {
    try {
      const data = await productoService.patchEstado(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Producto actualizado correctamente.',
        data,
      });
    } catch (e) {
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      await productoService.remove(req.params.id);
      res.json({
        success: true,
        message: 'Producto desactivado correctamente.',
      });
    } catch (e) {
      next(e);
    }
  },

  async unidades(req, res) {
    res.json({
      success: true,
      data: productoService.unidadesValidas(),
    });
  },
};

export default productoController;
