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

            const codigoClasificacion = `${codigoElemento}.${clasificacion.codigoNumerico}`;

            const cuentasClasificacion = cuentas
              .filter(cu =>
                cu.uuidElementoContable === elemento.uuidElementoContable &&
                cu.uuidClasificacionContable === clasificacion.uuidClasificacionContable
              )
              .sort((a, b) => a.codigoNumerico - b.codigoNumerico)
              .map((cuenta) => {

                const codigoCuenta =
                  `${codigoClasificacion}.${formatCodigo(cuenta.codigoNumerico)}`;

                const subcuentasCuenta = subcuentas
                  .filter(sc => sc.uuidCuentaContable === cuenta.uuidCuentaContable)
                  .sort((a, b) => a.codigoNumerico - b.codigoNumerico)
                  .map((subcuenta) => {

                    const codigoSubcuenta =
                      `${codigoCuenta}.${formatCodigo(subcuenta.codigoNumerico, 3)}`;

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