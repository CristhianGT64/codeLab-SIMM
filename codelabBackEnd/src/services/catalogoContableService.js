import catalogoContableRepository from '../repositories/catalogoContableRepository.js';

function formatCodigo(num, size = 2) {
  return String(num).padStart(size, '0');
}

const catalogoContableService = {
  async getArbol() {
    const { elementos, clasificaciones, cuentas, subcuentas } =
      await catalogoContableRepository.getAllData();

    const arbol = elementos
      .sort((a, b) => a.codigoNumerico - b.codigoNumerico)
      .map((elemento) => {

        const codigoElemento = `${elemento.codigoNumerico}`;

        const clasificacionesElemento = clasificaciones
          .filter(c => c.uuidElementoContable === elemento.uuidElementoContable)
          .sort((a, b) => a.codigoNumerico - b.codigoNumerico)
          .map((clasificacion) => {

            // 🔧 CORRECCIÓN CLASIFICACIÓN
            const clasificacionNum = String(clasificacion.codigoNumerico).slice(-1);
            const codigoClasificacion =
              `${codigoElemento}.${clasificacionNum}`;

            const cuentasClasificacion = cuentas
              .filter(cu =>
                cu.uuidElementoContable === elemento.uuidElementoContable &&
                cu.uuidClasificacionContable === clasificacion.uuidClasificacionContable
              )
              .sort((a, b) => a.codigoNumerico - b.codigoNumerico)
              .map((cuenta) => {

                // 🔧 CORRECCIÓN CUENTA
                const cuentaNum = String(cuenta.codigoNumerico).slice(-2);
                const codigoCuenta =
                  `${codigoClasificacion}.${cuentaNum}`;

                const subcuentasCuenta = subcuentas
                  .filter(sc => sc.uuidCuentaContable === cuenta.uuidCuentaContable)
                  .sort((a, b) => a.codigoNumerico - b.codigoNumerico)
                  .map((subcuenta) => {

                    // 🔧 CORRECCIÓN SUBCUENTA
                    const subCuentaNum = String(subcuenta.codigoNumerico).slice(-3);
                    const codigoSubcuenta =
                      `${codigoCuenta}.${subCuentaNum}`;

                    return {
                      ...subcuenta,
                      codigoContable: codigoSubcuenta,
                    };
                  });

                return {
                  ...cuenta,
                  codigoContable: codigoCuenta,
                  subcuentas: subcuentasCuenta,
                };
              });

            return {
              ...clasificacion,
              codigoContable: codigoClasificacion,
              cuentas: cuentasClasificacion,
            };
          });

        return {
          ...elemento,
          codigoContable: codigoElemento,
          clasificaciones: clasificacionesElemento,
        };
      });

    return arbol;
  },

  async getResumen() {
    const { elementos, clasificaciones, cuentas, subcuentas } =
      await catalogoContableRepository.getAllData();

    return {
      totalElementos: elementos.length,
      totalClasificaciones: clasificaciones.length,
      totalCuentas: cuentas.length,
      totalSubcuentas: subcuentas.length,
    };
  },
};

export default catalogoContableService;