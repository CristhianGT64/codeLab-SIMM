import proveedorRepository from '../repositories/proveedorRepository.js';

const proveedorService = {
  async create(body) {
    const { nombre, telefono, correo, direccion } = body;

    if (!nombre || !String(nombre).trim()) {
      const err = new Error('El nombre del proveedor es obligatorio.');
      err.status = 400;
      throw err;
    }

    const nombreLimpio = String(nombre).trim();

    const existente = await proveedorRepository.findByNombre(nombreLimpio);
    if (existente) {
      const err = new Error('Ya existe un proveedor con ese nombre.');
      err.status = 409;
      throw err;
    }

    return proveedorRepository.create({
      nombre: nombreLimpio,
      telefono: telefono ? String(telefono).trim() : null,
      correo: correo ? String(correo).trim().toLowerCase() : null,
      direccion: direccion ? String(direccion).trim() : null,
      disponible: true,
    });
  },

  async getAll(query = {}) {
    const data = await proveedorRepository.findAll();

    if (query.disponible === undefined) {
      return data;
    }

    if (!['true', 'false'].includes(String(query.disponible))) {
      const err = new Error('El filtro disponible debe ser true o false.');
      err.status = 400;
      throw err;
    }

    const disponible = String(query.disponible) === 'true';
    return data.filter((item) => item.disponible === disponible);
  },

  async getById(idParam) {
    if (!idParam) {
      const err = new Error('El id del proveedor es obligatorio.');
      err.status = 400;
      throw err;
    }

    const proveedor = await proveedorRepository.findById(idParam);
    if (!proveedor) {
      const err = new Error('Proveedor no encontrado.');
      err.status = 404;
      throw err;
    }

    return proveedor;
  },

  async update(idParam, body = {}) {
    if (!idParam) {
      const err = new Error('El id del proveedor es obligatorio.');
      err.status = 400;
      throw err;
    }

    const actual = await proveedorRepository.findById(idParam);
    if (!actual) {
      const err = new Error('Proveedor no encontrado.');
      err.status = 404;
      throw err;
    }

    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
      const err = new Error('Body inválido para actualizar proveedor.');
      err.status = 400;
      throw err;
    }

    if (body.nombre !== undefined) {
      if (!String(body.nombre).trim()) {
        const err = new Error('El nombre del proveedor no puede estar vacío.');
        err.status = 400;
        throw err;
      }

      const nombreLimpio = String(body.nombre).trim();
      if (nombreLimpio.toLowerCase() !== actual.nombre.toLowerCase()) {
        const existente = await proveedorRepository.findByNombre(nombreLimpio);
        if (existente) {
          const err = new Error('Ya existe otro proveedor con ese nombre.');
          err.status = 409;
          throw err;
        }
      }
    }

    const data = {};

    if (body.nombre !== undefined) data.nombre = String(body.nombre).trim();
    if (body.telefono !== undefined) data.telefono = body.telefono ? String(body.telefono).trim() : null;
    if (body.correo !== undefined) data.correo = body.correo ? String(body.correo).trim().toLowerCase() : null;
    if (body.direccion !== undefined) data.direccion = body.direccion ? String(body.direccion).trim() : null;

    return proveedorRepository.update(idParam, data);
  },

  async patchDisponibilidad(idParam, body = {}) {
    if (!idParam) {
      const err = new Error('El id del proveedor es obligatorio.');
      err.status = 400;
      throw err;
    }

    const actual = await proveedorRepository.findById(idParam);
    if (!actual) {
      const err = new Error('Proveedor no encontrado.');
      err.status = 404;
      throw err;
    }

    if (typeof body.disponible !== 'boolean') {
      const err = new Error('El campo disponible debe ser boolean.');
      err.status = 400;
      throw err;
    }

    return proveedorRepository.update(idParam, {
      disponible: body.disponible,
    });
  },

  async remove(idParam) {
    const actual = await proveedorRepository.findById(idParam);
    if (!actual) {
      const err = new Error('Proveedor no encontrado.');
      err.status = 404;
      throw err;
    }

    return proveedorRepository.update(idParam, {
      disponible: false,
    });
  },
};

export default proveedorService;