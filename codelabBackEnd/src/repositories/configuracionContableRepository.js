import prisma from '../infra/prisma/prismaClient.js';

const mapConfiguracionSistema = (row) => {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    metodoValuacion: row.metodoValuacion,
    monedaFuncional: row.monedaFuncional,
  };
};

const configuracionContableRepository = {
  async findFirst() {
    const config = await prisma.configuracionContable.findFirst({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        metodoValuacion: true,
        monedaFuncional: true,
      },
    });

    return mapConfiguracionSistema(config);
  },

  async create(data) {
    const created = await prisma.configuracionContable.create({
      data: {
        metodoValuacion: data.metodoValuacion,
        monedaFuncional: data.monedaFuncional,
      },
      select: {
        id: true,
        metodoValuacion: true,
        monedaFuncional: true,
      },
    });

    return mapConfiguracionSistema(created);
  },

  async update(id, data) {
    const updated = await prisma.configuracionContable.update({
      where: { id: BigInt(id) },
      data: {
        metodoValuacion: data.metodoValuacion,
        monedaFuncional: data.monedaFuncional,
      },
      select: {
        id: true,
        metodoValuacion: true,
        monedaFuncional: true,
      },
    });

    return mapConfiguracionSistema(updated);
  },
};

export default configuracionContableRepository;