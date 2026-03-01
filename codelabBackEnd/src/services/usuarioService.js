import bcrypt from 'bcryptjs';
import usuarioRepository from '../repositories/usuarioRepository.js';
import rolRepository from '../repositories/rolRepository.js';
import sucursalRepository from '../repositories/sucursalRepository.js';

const usuarioService = {
  async create({ nombreCompleto, correo, usuario, password, rolId, sucursalId }) {
    if (!nombreCompleto || !correo || !usuario || !password || !rolId || !sucursalId) {
      const error = new Error('Faltan campos obligatorios: nombreCompleto, correo, usuario, password, rolId, sucursalId');
      error.status = 400;
      throw error;
    }

    // Validar rol y sucursal existan
    const [rol, sucursal] = await Promise.all([
      rolRepository.findById(BigInt(rolId)),
      sucursalRepository.findById(BigInt(sucursalId)),
    ]);

    if (!rol) {
      const error = new Error('El rol asignado no existe.');
      error.status = 400;
      throw error;
    }
    if (!sucursal) {
      const error = new Error('La sucursal asignada no existe.');
      error.status = 400;
      throw error;
    }

    // Restaurar si existe eliminado
    const deleted = await usuarioRepository.findDeletedByCorreoOrUsuario(correo, usuario);
    if (deleted) {
      const passwordHash = await bcrypt.hash(password, 10);
      return usuarioRepository.restoreById(deleted.id, {
        nombreCompleto,
        correo,
        usuario,
        password: passwordHash,
        rolId: BigInt(rolId),
        sucursalId: BigInt(sucursalId),
        eliminado: false,
        estado: 'activo',
      });
    }

    // Validar duplicados activos
    const dup = await usuarioRepository.findActiveByCorreoOrUsuario(correo, usuario);
    if (dup) {
      const error = new Error('El correo o el usuario ya están registrados.');
      error.status = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    return usuarioRepository.create({
      nombreCompleto,
      correo,
      usuario,
      password: passwordHash,
      estado: 'activo',
      eliminado: false,
      rolId: BigInt(rolId),
      sucursalId: BigInt(sucursalId),
    });
  },

  getAll() {
    return usuarioRepository.getAllNotDeleted();
  },

  async getById(idParam) {
    let id;

    try {
      id = BigInt(idParam);
    } catch {
      const error = new Error('El id de usuario no es válido.');
      error.status = 400;
      throw error;
    }

    const data = await usuarioRepository.getNotDeletedById(id);

    if (!data) {
      const error = new Error('Usuario no encontrado.');
      error.status = 404;
      throw error;
    }

    return data;
  },

  async update(idParam, { nombreCompleto, correo, usuario, password, rolId, sucursalId, estado }) {
    const id = BigInt(idParam);

    const current = await usuarioRepository.findNotDeletedById(id);
    if (!current) {
      const error = new Error('Usuario no encontrado (o eliminado).');
      error.status = 404;
      throw error;
    }

    // Validar rol/sucursal si vienen
    if (rolId !== undefined && rolId !== null) {
      const rol = await rolRepository.findById(BigInt(rolId));
      if (!rol) {
        const error = new Error('El rol asignado no existe.');
        error.status = 400;
        throw error;
      }
    }

    if (sucursalId !== undefined && sucursalId !== null) {
      const sucursal = await sucursalRepository.findById(BigInt(sucursalId));
      if (!sucursal) {
        const error = new Error('La sucursal asignada no existe.');
        error.status = 400;
        throw error;
      }
    }

    // Validar duplicados si cambian
    const correoNuevo = correo !== undefined ? correo : current.correo;
    const usuarioNuevo = usuario !== undefined ? usuario : current.usuario;

    if (correoNuevo !== current.correo || usuarioNuevo !== current.usuario) {
      const dupActive = await usuarioRepository.findDupActiveNotSelf(id, correoNuevo, usuarioNuevo);
      if (dupActive) {
        const error = new Error('El correo o el usuario ya están registrados.');
        error.status = 409;
        throw error;
      }

      const dupDeleted = await usuarioRepository.findDupDeleted(correoNuevo, usuarioNuevo);
      if (dupDeleted) {
        const error = new Error('El correo o el usuario pertenecen a un usuario eliminado. Restaura ese usuario o usa otros valores.');
        error.status = 409;
        throw error;
      }
    }

    const data = {};
    if (nombreCompleto !== undefined) data.nombreCompleto = nombreCompleto;
    if (correo !== undefined) data.correo = correo;
    if (usuario !== undefined) data.usuario = usuario;
    if (estado !== undefined) data.estado = estado;
    if (rolId !== undefined && rolId !== null) data.rolId = BigInt(rolId);
    if (sucursalId !== undefined && sucursalId !== null) data.sucursalId = BigInt(sucursalId);

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    return usuarioRepository.updateById(id, data);
  },

  async remove(idParam) {
    const id = BigInt(idParam);

    const current = await usuarioRepository.findNotDeletedById(id);
    if (!current) {
      const error = new Error('Usuario no encontrado.');
      error.status = 404;
      throw error;
    }

    await usuarioRepository.softDelete(id);
    return true;
  },

  async activate(idParam) {
    let id;

    try {
      id = BigInt(idParam);
    } catch {
      const error = new Error('El id de usuario no es válido.');
      error.status = 400;
      throw error;
    }

    const current = await usuarioRepository.findNotDeletedById(id);
    if (!current) {
      const error = new Error('Usuario no encontrado (o eliminado).');
      error.status = 404;
      throw error;
    }

    return usuarioRepository.updateEstadoById(id, 'activo');
  },

  async deactivate(idParam) {
    let id;

    try {
      id = BigInt(idParam);
    } catch {
      const error = new Error('El id de usuario no es válido.');
      error.status = 400;
      throw error;
    }

    const current = await usuarioRepository.findNotDeletedById(id);
    if (!current) {
      const error = new Error('Usuario no encontrado (o eliminado).');
      error.status = 404;
      throw error;
    }

    return usuarioRepository.updateEstadoById(id, 'inactivo');
  },
};

export default usuarioService;