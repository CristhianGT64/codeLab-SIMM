import catalogoContableRepository from '../repositories/catalogoContableRepository.js';

const catalogoContableService = {
  async getArbol() {
    const { elementos, clasificaciones, cuentas, subcuentas } =
      await catalogoContableRepository.getAllData();

    const arbol = elementos.map((elemento) => {
      const clasificacionesElemento = clasificaciones
        .filter(c => c.uuidElementoContable === elemento.uuidElementoContable)
        .map((clasificacion) => {

          const cuentasClasificacion = cuentas
            .filter(cu =>
              cu.uuidElementoContable === elemento.uuidElementoContable &&
              cu.uuidClasificacionContable === clasificacion.uuidClasificacionContable
            )
            .map((cuenta) => {

              const subcuentasCuenta = subcuentas.filter(sc =>
                sc.uuidCuentaContable === cuenta.uuidCuentaContable
              );

              return {
                ...cuenta,
                subcuentas: subcuentasCuenta,
              };
            });

          return {
            ...clasificacion,
            cuentas: cuentasClasificacion,
          };
        });

      return {
        ...elemento,
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