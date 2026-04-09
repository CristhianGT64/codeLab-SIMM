import prisma from '../../infra/prisma/prismaClient.js';

const toBigInt = (value) => BigInt(value);

const buildDateWhere = ({ fechaInicio, fechaFin }) => {
  const where = {};

  if (fechaInicio) {
    where.gte = fechaInicio;
  }

  if (fechaFin) {
    where.lte = fechaFin;
  }

  return Object.keys(where).length > 0 ? where : undefined;
};

const buildAjusteConditions = (tipoAjuste) => {
  if (tipoAjuste === 'PERDIDA') {
    return [
      { tipoAjuste: 'PERDIDA' },
      {
        AND: [
          { tipoAjuste: null },
          { tipo: 'salida' },
          { motivoSalida: 'AJUSTE' },
        ],
      },
    ];
  }

  if (tipoAjuste === 'DETERIORO') {
    return [
      { tipoAjuste: 'DETERIORO' },
      {
        AND: [
          { tipoAjuste: null },
          { tipo: 'salida' },
          { motivoSalida: 'DANIO' },
        ],
      },
    ];
  }

  if (tipoAjuste === 'SOBRANTE') {
    return [{ tipoAjuste: 'SOBRANTE' }];
  }

  return [
    { tipoAjuste: 'PERDIDA' },
    { tipoAjuste: 'DETERIORO' },
    { tipoAjuste: 'SOBRANTE' },
    {
      AND: [
        { tipoAjuste: null },
        { tipo: 'salida' },
        { motivoSalida: 'AJUSTE' },
      ],
    },
    {
      AND: [
        { tipoAjuste: null },
        { tipo: 'salida' },
        { motivoSalida: 'DANIO' },
      ],
    },
  ];
};

const ajustesInventarioReportRepository = {
  async findAjustes(filters = {}) {
    const { productoId, fechaInicio, fechaFin, tipoAjuste } = filters;

    const where = {
      OR: buildAjusteConditions(tipoAjuste),
    };

    if (productoId) {
      where.productoId = toBigInt(productoId);
    }

    const fechaMovimiento = buildDateWhere({ fechaInicio, fechaFin });

    if (fechaMovimiento) {
      where.fechaMovimiento = fechaMovimiento;
    }

    return prisma.movimientoInventario.findMany({
      where,
      orderBy: [
        { fechaMovimiento: 'desc' },
        { id: 'desc' },
      ],
      select: {
        id: true,
        tipo: true,
        cantidad: true,
        fechaMovimiento: true,
        detalleMotivo: true,
        observaciones: true,
        stockResultante: true,
        motivoSalida: true,
        tipoAjuste: true,
        costoUnitario: true,
        costoTotal: true,
        referenciaTipo: true,
        producto: {
          select: {
            id: true,
            nombre: true,
            sku: true,
            unidadMedida: true,
            costo: true,
          },
        },
        sucursal: {
          select: {
            id: true,
            nombre: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nombreCompleto: true,
            usuario: true,
          },
        },
      },
    });
  },
};

export default ajustesInventarioReportRepository;
