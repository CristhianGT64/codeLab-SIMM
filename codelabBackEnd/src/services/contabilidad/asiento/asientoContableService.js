import { randomUUID } from 'crypto';
import prisma from '../../../infra/prisma/prismaClient.js';
import asientoContableRepository from '../../../repositories/contabilidad/asiento/asientoContableRepository.js';
import reglaContableRepository from '../../../repositories/contabilidad/asiento/reglaContableRepository.js';

function buildError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

const asientoContableService = {

  async generarNumeroAsiento(tx) {

    const ultimo = await tx.asientoContable.findFirst({
      orderBy: { id: "desc" },
      select: { numeroAsiento: true }
    });

    if (!ultimo) return 'AS-000001';

    const numero = parseInt(ultimo.numeroAsiento.split('-')[1]) + 1;

    return `AS-${numero.toString().padStart(6, '0')}`;
  },

  async generarAsiento({
    tipoOperacion,
    idOperacionOrigen,
    descripcion,
    subtotal,
    impuesto,
    total,
    tx
  }) {

    const reglas = await reglaContableRepository.findByOperacion(tipoOperacion);

    if (!reglas.length) {
      throw buildError('No existen reglas contables configuradas.');
    }

    const prismaClient = tx || prisma;
    const numeroAsiento = await this.generarNumeroAsiento(prismaClient);

    const detalles = [];
    let orden = 1;

    let totalDebe = 0;
    let totalHaber = 0;

    const regla = reglas[0];

    const subtotalNum = parseFloat(subtotal);
    const impuestoNum = parseFloat(impuesto || 0);
    const totalNum = parseFloat(total);

    // DEBE (Caja / Banco)
    detalles.push({
      uuidDetalle: `detalle-${tipoOperacion.toLowerCase()}-${idOperacionOrigen}-${orden}`,
      subCuentaContableId: regla.subCuentaDebeId,
      montoDebe: totalNum,
      montoHaber: 0,
      descripcion,
      orden: orden++
    });

    totalDebe += totalNum;

    // HABER (Ventas)
    detalles.push({
      uuidDetalle: `detalle-${tipoOperacion.toLowerCase()}-${idOperacionOrigen}-${orden}`,
      subCuentaContableId: regla.subCuentaHaberId,
      montoDebe: 0,
      montoHaber: subtotalNum,
      descripcion,
      orden: orden++
    });

    totalHaber += subtotalNum;

    // HABER (Impuesto)
    if (impuestoNum > 0 && regla.subCuentaImpuestoId) {

      detalles.push({
        uuidDetalle: `detalle-${tipoOperacion.toLowerCase()}-${idOperacionOrigen}-${orden}`,
        subCuentaContableId: regla.subCuentaImpuestoId,
        montoDebe: 0,
        montoHaber: impuestoNum,
        descripcion,
        orden: orden++
      });

      totalHaber += impuestoNum;

    }

    if (totalDebe !== totalHaber) {
      throw buildError('El asiento no está balanceado.');
    }

    const uuidAsientoContable =
      `asiento-${tipoOperacion.toLowerCase()}-${idOperacionOrigen}`;

    return asientoContableRepository.create({
      uuidAsientoContable: uuidAsientoContable,
      numeroAsiento,
      descripcion,
      tipoOperacion,
      idOperacionOrigen,
      totalDebe,
      totalHaber,
      balanceado: true
    }, detalles, tx);

  },

  async list() {
    return asientoContableRepository.findAll();
  },

  async getById(id) {
    return asientoContableRepository.findById(BigInt(id));
  }

};

export default asientoContableService;