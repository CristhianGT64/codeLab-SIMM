import type { ClientType } from '../interfaces/Clients/ClientInterface';

export const CLIENT_TYPE_OPTIONS: ClientType[] = ['Contado', 'Crédito', 'Mayorista', 'Minorista'];

const CLIENT_TYPE_TO_ID: Record<ClientType, string> = {
  Mayorista: '1',
  Crédito: '2',
  Contado: '3',
  Minorista: '5',
};

const TYPE_ALIASES: Array<{ match: (value: string) => boolean; type: ClientType }> = [
  { match: (value) => value === '1' || value.includes('mayor'), type: 'Mayorista' },
  { match: (value) => value === '2' || value === '4' || value.includes('credito'), type: 'Crédito' },
  { match: (value) => value === '3' || value.includes('contado'), type: 'Contado' },
  { match: (value) => value === '5' || value.includes('minor') || value.includes('natural'), type: 'Minorista' },
];

const normalizeTypeValue = (value: unknown): string =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]/g, '')
    .trim();

export const getClientTypeId = (type: ClientType): string => CLIENT_TYPE_TO_ID[type];

export const getClientTypeFromValue = (value: unknown, fallback: ClientType = 'Minorista'): ClientType => {
  const normalized = normalizeTypeValue(value);

  if (!normalized) return fallback;

  const match = TYPE_ALIASES.find((item) => item.match(normalized));
  return match?.type ?? fallback;
};

export const resolveClientType = (
  tipoCliente: unknown,
  tipoClienteId?: unknown,
  fallback: ClientType = 'Minorista',
): { tipoCliente: ClientType; tipoClienteId: string } => {
  const resolvedType = getClientTypeFromValue(tipoCliente, getClientTypeFromValue(tipoClienteId, fallback));

  return {
    tipoCliente: resolvedType,
    tipoClienteId: getClientTypeId(resolvedType),
  };
};