import { buildCaiError } from './caiErrors.js';
import { toCaiView, toDetailedCaiView } from './caiMapper.js';
import { parseBigIntOrThrow, validateCreateCaiInput } from './caiValidator.js';

const DEFAULT_CAI_CONFIG = {
  establecimientoId: 1n,
  puntoEmisionNumero: 1,
};

export function buildCaiService({
  caiRepository,
  tipoDocumentoRepository,
  config = DEFAULT_CAI_CONFIG,
}) {
  return {
    async create(body = {}) {
      const payload = validateCreateCaiInput(body);

      const existente = await caiRepository.findByCodigo(payload.codigo);
      if (existente) {
        throw buildCaiError('Ya existe un CAI con ese codigo.', 409);
      }

      const tipoDocumento = await tipoDocumentoRepository.findById(payload.tipoDocumentoId);
      if (!tipoDocumento) {
        throw buildCaiError('El tipo de documento indicado no existe.', 404);
      }

      const created = await caiRepository.createWithRange(payload, config);
      return toCaiView(created);
    },

    async listAll() {
      const data = await caiRepository.listAllDetailed();
      return data.map(toDetailedCaiView);
    },

    async getByIdOrLatestVigente(id) {
      const hasId = id !== undefined && id !== null && id !== '';
      const data = hasId
        ? await caiRepository.findByIdDetailed(parseBigIntOrThrow(id, 'id_cai'))
        : await caiRepository.findLatestVigenteDetailed();

      if (!data) {
        throw buildCaiError(
          hasId ? 'No existe un CAI con el id indicado.' : 'No existe un CAI vigente.',
          404,
        );
      }

      return toDetailedCaiView(data);
    },
  };
}
