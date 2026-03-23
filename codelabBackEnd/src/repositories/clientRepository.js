import prisma from '../infra/prisma/prismaClient.js';

const clientRepository = {

  async getAllClients(search = '') {
    const where = search
      ? {
          OR: [
            { nombreCompleto: { contains: search, mode: 'insensitive' } },
            { identificacion: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    return await prisma.cliente.findMany({
      where,
      include: {
        tipoCliente: true,
      },
    });
  },

  async getClientById(id) {
    return await prisma.cliente.findUnique({
      where: { id: Number(id) },
      include: {
        facturas: true,
        tipoCliente: true,
      },
    });
  },

  async getByIdentificacion(identificacion) {
    if (!identificacion) return null;
    return await prisma.cliente.findUnique({
      where: { identificacion },
    });
  },

  findById(id) {
    return prisma.cliente.findUnique({
      where: { id: Number(id) },
      select: { id: true },
    });
  },

  async createClient(data) {
    let tipoClienteId;

    if (data.tipoClienteId !== undefined && data.tipoClienteId !== null) {
      tipoClienteId = Number(data.tipoClienteId);
      const existing = await prisma.tipoCliente.findUnique({
        where: { id: tipoClienteId },
      });
      if (!existing) {
        tipoClienteId = undefined;
      }
    }

    if (!tipoClienteId && data.tipoCliente) {
      const nombre = String(data.tipoCliente).trim();
      const found = await prisma.tipoCliente.findFirst({
        where: { nombre: { equals: nombre, mode: 'insensitive' } },
      });
      if (found) {
        tipoClienteId = found.id;
      } else {
        const created = await prisma.tipoCliente.create({
          data: { nombre },
        });
        tipoClienteId = created.id;
      }
    }

    const payload = {
      ...data,
      tipoClienteId: tipoClienteId !== undefined ? tipoClienteId : undefined,
    };

    delete payload.tipoCliente;

    return await prisma.cliente.create({
      data: payload,
    });
  },

  async updateClient(id, data) {
    let tipoClienteId;

    if (data.tipoClienteId !== undefined && data.tipoClienteId !== null) {
      tipoClienteId = Number(data.tipoClienteId);
      const existing = await prisma.tipoCliente.findUnique({
        where: { id: tipoClienteId },
      });
      if (!existing) {
        tipoClienteId = undefined;
      }
    }

    if (!tipoClienteId && data.tipoCliente) {
      const nombre = String(data.tipoCliente).trim();
      const found = await prisma.tipoCliente.findFirst({
        where: { nombre: { equals: nombre, mode: 'insensitive' } },
      });
      if (found) {
        tipoClienteId = found.id;
      } else {
        const created = await prisma.tipoCliente.create({
          data: { nombre },
        });
        tipoClienteId = created.id;
      }
    }

    const payload = {
      ...data,
      tipoClienteId: tipoClienteId !== undefined ? tipoClienteId : data.tipoClienteId,
    };

    delete payload.tipoCliente;

    return await prisma.cliente.update({
      where: { id: Number(id) },
      data: payload,
    });
  },
};

export default clientRepository;