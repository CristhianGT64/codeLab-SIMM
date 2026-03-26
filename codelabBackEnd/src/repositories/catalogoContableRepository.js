import elementoContableRepository from './elementoContableRepository.js';
import clasificacionElementoContableRepository from './clasificacionElementoContableRepository.js';
import cuentaContableRepository from './cuentaContableRepository.js';
import subCuentaContableRepository from './subCuentaContableRepository.js';

const catalogoContableRepository = {
  async getAllData() {
    const [elementos, clasificaciones, cuentas, subcuentas] = await Promise.all([
      elementoContableRepository.list(),
      clasificacionElementoContableRepository.list(),
      cuentaContableRepository.list(),
      subCuentaContableRepository.list(),
    ]);

    return { elementos, clasificaciones, cuentas, subcuentas };
  },
};

export default catalogoContableRepository;