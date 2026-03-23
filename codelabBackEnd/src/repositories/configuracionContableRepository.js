import prisma from '../infra/prisma/prismaClient.js';

const mapConfiguracionSistema = (row) => {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    metodoValuacion: row.metodoValuacionInventario,
    monedaFuncional: row.monedaFuncional,
  };
};

const configuracionContableRepository = {
  async findFirst() {
    const config = await prisma.configuracionSistema.findFirst({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        metodoValuacionInventario: true,
        monedaFuncional: true,
      },
    });

    return mapConfiguracionSistema(config);
  },

  async create(data) {
    const created = await prisma.configuracionSistema.create({
      data: {
        metodoValuacionInventario: data.metodoValuacion,
        monedaFuncional: data.monedaFuncional,
      },
      select: {
        id: true,
        metodoValuacionInventario: true,
        monedaFuncional: true,
      },
    });

    return mapConfiguracionSistema(created);
  },

  async update(id, data) {
    const updated = await prisma.configuracionSistema.update({
      where: { id: BigInt(id) },
      data: {
        metodoValuacionInventario: data.metodoValuacion,
        monedaFuncional: data.monedaFuncional,
      },
      select: {
        id: true,
        metodoValuacionInventario: true,
        monedaFuncional: true,
      },
    });

    return mapConfiguracionSistema(updated);
  },
};

export default configuracionContableRepository;
