import caiRepository from '../repositories/caiRepository.js';
import tipoDocumentoRepository from '../repositories/tipoDocumentoRepository.js';
import { buildCaiService } from './cai/buildCaiService.js';

const caiService = buildCaiService({
  caiRepository,
  tipoDocumentoRepository,
});

export default caiService;
