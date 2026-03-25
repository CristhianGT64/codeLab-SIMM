import elementoContableRepository from './elementoContableRepository.js';
import clasificacionElementoContableRepository from './clasificacionElementoContableRepository.js';
import cuentaContableRepository from './cuentaContableRepository.js';
import subCuentaContableRepository from './subCuentaContableRepository.js';

const catalogoContableRepository = {
  async getAllData() {
    const [elementos, clasificaciones, cuentas, subcuentas] = await Promise.all([
      elementoContableRepository.list({ disponible: true }),
      clasificacionElementoContableRepository.list({ disponible: true }),
      cuentaContableRepository.list({ disponible: true }),
      subCuentaContableRepository.list({ disponible: true }),
    ]);

    return { elementos, clasificaciones, cuentas, subcuentas };
  },
};

export default catalogoContableRepository;