import configuracionContableRepository from '../repositories/configuracionContableRepository.js';

const METODOS_VALIDOS = ['FIFO', 'PROMEDIO_PONDERADO'];

const configuracionContableService = {
  async getMetodoInventario() {
    let config = await configuracionContableRepository.findFirst();

    if (!config) {
      config = await configuracionContableRepository.create({
        metodoValuacion: 'FIFO',
        monedaFuncional: 'HNL',
      });
    }

    return config;
  },

  async updateMetodoInventario(body = {}) {
    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
      const err = new Error('Body inválido para actualizar la configuración del método de inventario.');
      err.status = 400;
      throw err;
    }

    const actual = await this.getMetodoInventario();

    if (body.metodoValuacion === undefined) {
      const err = new Error('metodoValuacion es obligatorio.');
      err.status = 400;
      throw err;
    }

    if (!METODOS_VALIDOS.includes(body.metodoValuacion)) {
      const err = new Error('metodoValuacion inválido. Valores permitidos: FIFO, PROMEDIO_PONDERADO');
      err.status = 400;
      throw err;
    }

    const data = {
      metodoValuacion: body.metodoValuacion,
    };

    if (body.monedaFuncional !== undefined) {
      const moneda = String(body.monedaFuncional).trim().toUpperCase();

      if (!moneda) {
        const err = new Error('monedaFuncional no puede estar vacía.');
        err.status = 400;
        throw err;
      }

      if (moneda.length > 10) {
        const err = new Error('monedaFuncional no puede tener más de 10 caracteres.');
        err.status = 400;
        throw err;
      }

      data.monedaFuncional = moneda;
    }

    // Pendiente:
    // validar si existen períodos contables cerrados antes de permitir el cambio

    return configuracionContableRepository.update(actual.id, data);
  },

  metodosValidos() {
    return METODOS_VALIDOS;
  },
};

export default configuracionContableService;