import prisma from "../infra/prisma/prismaClient.js";

const facturaRepository = {

  //  Crear factura
  async createFactura(data, tx = prisma) {
    return await tx.factura.create({
      data
    });
  },

  // Crear múltiples detalles de factura
  async createDetalleFacturaMany(detalles, tx = prisma) {
    return await tx.detalleFactura.createMany({
      data: detalles
    });
  },

  //  Obtener factura por número formateado
  async findFacturaByNumero(numeroFactura) {
    return await prisma.factura.findFirst({
      where: {
        numeroFactura: {
          numeroFormateado: numeroFactura
        }
      },
      include: {
        detalles: true,
        cliente: true,
        usuario: true,
        sucursal: true,
        numeroFactura: true
      }
    });
  },
  async findFacturaByNumero(numeroFactura) {
  return await prisma.factura.findFirst({
    where: {
      numeroFormateado: numeroFactura 
    },
    include: {
      detalles: {
        include: {
          producto: {
            select: {
              nombre: true
            }
          }
        }
      },
      cliente: true,
      usuario: true,
      sucursal: true,
      numeroFactura: {
        include: {
          cai: {
              include: {
                rangoEmision: {
                  select: {
                    inicioRango: true,
                    finRango: true
                  }
                }
              }
            }
        }
      }
    }
  });
},

  //  Listar facturas con filtros
 /*  async findFacturas({ usuarioId, clienteId, sucursalId }) {

    const where = {};

    if (usuarioId) {
      where.usuarioId = Number(usuarioId);
    }

    if (clienteId) {
      where.clienteId = Number(clienteId);
    }

    if (sucursalId) {
      where.sucursalId = Number(sucursalId);
    }

    return await prisma.factura.findMany({
      where,
      include: {
        cliente: true,
        usuario: true,
        sucursal: true,
        numeroFactura: {
          include: {
            cai: {
              select: {
                id: true,
                codigo: true,
                fechaInicio: true,
                fechaFin: true
              }
            }
          }
        }
      },
      orderBy: {
        id: "desc"
      }
    });

  },
 */
  async findFacturas({ usuarioId, clienteId, sucursalId }) {

  const where = {};

  if (usuarioId) where.usuarioId = Number(usuarioId);
  if (clienteId) where.clienteId = Number(clienteId);
  if (sucursalId) where.sucursalId = Number(sucursalId);

  return await prisma.factura.findMany({
    where,
    include: {
      detalles: {
        include: {
          producto: {
            select: {
              nombre: true
            }
          }
        }
      },
      cliente: true,
      usuario: true,
      sucursal: true,
      numeroFactura: {
        include: {
          cai: {
            include: {
              rangoEmision: {
                select: {
                  inicioRango: true,
                  finRango: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: { id: "desc" }
  });
},
  //  Obtener último correlativo
 async getLastCorrelativo({
  tipoDocumentoId,
  establecimientoId,
  puntoEmisionId,
  caiId
}) {
  const result = await prisma.numeroFactura.aggregate({
    _max: {
      correlativo: true
    },
    where: {
      tipoDocumentoId: BigInt(tipoDocumentoId),
      establecimientoId: BigInt(establecimientoId),
      puntoEmisionId: BigInt(puntoEmisionId),
      caiId: BigInt(caiId)
    }
  });
console.log("📊 getLastCorrelativo result:", result);
  return result._max.correlativo ?? 0;
},

  //  Crear NumeroFactura
  async createNumeroFactura(data, tx = prisma) {
    return await tx.numeroFactura.create({
      data
    });
  }

};

export default facturaRepository;