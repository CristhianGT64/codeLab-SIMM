import prisma from '../infra/prisma/prismaClient.js';

const caiSelect = {
  id_cai: true,
  codigo: true,
  fecha_inicio: true,
  fecha_fin: true,
  activo: true,
  RangoEmision: {
    select: {
      id_rango_emision: true,
      inicio_rango: true,
      final_rango: true,
      id_cai: true,
    },
  },
};

function toRangeView(rango) {
  if (!rango) {
    return null;
  }

  return {
    id_rango_emision: rango.id_rango_emision,
    inicio_rango: rango.inicio_rango,
    final_rango: rango.final_rango,
    id_cai: rango.id_cai,
  };
}

function toCaiView(cai) {
  if (!cai) {
    return null;
  }

  return {
    id_cai: cai.id_cai,
    codigo: cai.codigo,
    fechaInicio: cai.fecha_inicio,
    fechaFin: cai.fecha_fin,
    activo: cai.activo,
    rangoEmision: toRangeView(cai.RangoEmision),
  };
}

const caiRepository = {
  async findLastByFechaFin() {
    const cai = await prisma.cai.findFirst({
      orderBy: [
        { fecha_fin: 'desc' },
        { id_cai: 'desc' },
      ],
      select: caiSelect,
    });

    return toCaiView(cai);
  },

  async findLastRangeByFinal() {
    const rango = await prisma.rangoEmision.findFirst({
      orderBy: [
        { final_rango: 'desc' },
        { id_rango_emision: 'desc' },
      ],
      select: {
        id_rango_emision: true,
        inicio_rango: true,
        final_rango: true,
        id_cai: true,
      },
    });

    return toRangeView(rango);
  },

  async findByCodigo(codigo) {
    const cai = await prisma.cai.findUnique({
      where: { codigo },
      select: {
        id_cai: true,
      },
    });

    return cai;
  },

  createWithRange(data) {
    return prisma.$transaction(async (tx) => {
      const cai = await tx.cai.create({
        data: {
          codigo: data.codigo,
          fecha_inicio: data.fechaInicio,
          fecha_fin: data.fechaFin,
          activo: true,
        },
        select: {
          id_cai: true,
          codigo: true,
          fecha_inicio: true,
          fecha_fin: true,
          activo: true,
        },
      });

      const rango = await tx.rangoEmision.create({
        data: {
          inicio_rango: data.inicioRango,
          final_rango: data.finalRango,
          id_cai: cai.id_cai,
        },
        select: {
          id_rango_emision: true,
          inicio_rango: true,
          final_rango: true,
          id_cai: true,
        },
      });

      return {
        id_cai: cai.id_cai,
        codigo: cai.codigo,
        fechaInicio: cai.fecha_inicio,
        fechaFin: cai.fecha_fin,
        activo: cai.activo,
        rangoEmision: toRangeView(rango),
      };
    });
  },

  async listAll() {
    const cais = await prisma.cai.findMany({
      orderBy: [
        { fecha_inicio: 'desc' },
        { id_cai: 'desc' },
      ],
      select: caiSelect,
    });

    return cais.map(toCaiView);
  },

  async findLatestVigente(now = new Date()) {
    const cai = await prisma.cai.findFirst({
      where: {
        activo: true,
        fecha_inicio: {
          lte: now,
        },
        fecha_fin: {
          gte: now,
        },
      },
      orderBy: [
        { fecha_inicio: 'desc' },
        { id_cai: 'desc' },
      ],
      select: caiSelect,
    });

    return toCaiView(cai);
  },
};

export default caiRepository;