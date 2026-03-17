import prisma from '../infra/prisma/prismaClient.js';

const caiSelect = {
  id: true,
  codigo: true,
  fechaInicio: true,
  fechaFin: true,
  activo: true,
  rangoEmision: {
    select: {
      id: true,
      inicioRango: true,
      finRango: true,
      caiId: true,
    },
  },
};

function toRangeView(rango) {
  if (!rango) {
    return null;
  }

  return {
    id_rango_emision: rango.id,
    inicio_rango: rango.inicioRango,
    final_rango: rango.finRango,
    id_cai: rango.caiId,
  };
}

function toCaiView(cai) {
  if (!cai) {
    return null;
  }

  return {
    id_cai: cai.id,
    codigo: cai.codigo,
    fechaInicio: cai.fechaInicio,
    fechaFin: cai.fechaFin,
    activo: cai.activo,
    rangoEmision: toRangeView(cai.rangoEmision),
  };
}

const caiRepository = {
  async findLastByFechaFin() {
    const cai = await prisma.cai.findFirst({
      orderBy: [
        { fechaFin: 'desc' },
        { id: 'desc' },
      ],
      select: caiSelect,
    });

    return toCaiView(cai);
  },

  async findLastRangeByFinal() {
    const rango = await prisma.rangoEmision.findFirst({
      orderBy: [
        { finRango: 'desc' },
        { id: 'desc' },
      ],
      select: {
        id: true,
        inicioRango: true,
        finRango: true,
        caiId: true,
      },
    });

    return toRangeView(rango);
  },

  async findByCodigo(codigo) {
    const cai = await prisma.cai.findUnique({
      where: { codigo },
      select: {
        id: true,
      },
    });

    return cai;
  },

  createWithRange(data) {
    return prisma.$transaction(async (tx) => {
      const cai = await tx.cai.create({
        data: {
          codigo: data.codigo,
          fechaInicio: data.fechaInicio,
          fechaFin: data.fechaFin,
          activo: true,
        },
        select: {
          id: true,
          codigo: true,
          fechaInicio: true,
          fechaFin: true,
          activo: true,
        },
      });

      const rango = await tx.rangoEmision.create({
        data: {
          inicioRango: data.inicioRango,
          finRango: data.finalRango,
          caiId: cai.id,
        },
        select: {
          id: true,
          inicioRango: true,
          finRango: true,
          caiId: true,
        },
      });

      return {
        id_cai: cai.id,
        codigo: cai.codigo,
        fechaInicio: cai.fechaInicio,
        fechaFin: cai.fechaFin,
        activo: cai.activo,
        rangoEmision: toRangeView(rango),
      };
    });
  },

  async listAll() {
    const cais = await prisma.cai.findMany({
      orderBy: [
        { fechaInicio: 'desc' },
        { id: 'desc' },
      ],
      select: caiSelect,
    });

    return cais.map(toCaiView);
  },

  async findLatestVigente(now = new Date()) {
    const cai = await prisma.cai.findFirst({
      where: {
        activo: true,
        fechaInicio: {
          lte: now,
        },
        fechaFin: {
          gte: now,
        },
      },
      orderBy: [
        { fechaInicio: 'desc' },
        { id: 'desc' },
      ],
      select: caiSelect,
    });

    return toCaiView(cai);
  },
};

export default caiRepository;