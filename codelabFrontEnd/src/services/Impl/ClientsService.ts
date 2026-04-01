import axios from 'axios';
import settings from '../../lib/settings';
import type {
  Client,
  ClientDetail,
  CreateClientPayload,
  UpdateClientPayload,
  Invoice,
} from '../../interfaces/Clients/ClientInterface';
import { getClientTypeFromValue, getClientTypeId, resolveClientType } from '../../lib/clientTypes';

const API_URL = `${settings.URL}/clientes`;

type ApiRecord = Record<string, unknown>;
type ApiClientPayload = Omit<CreateClientPayload, 'tipoClienteId'> & {
  tipoClienteId?: number;
};
type ApiListResponse<T> = {
  data?: T;
};

const isApiRecord = (value: unknown): value is ApiRecord =>
  typeof value === 'object' && value !== null;

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string'
    ? value
    : typeof value === 'number'
    ? String(value)
    : fallback;

const asNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
};

const asApiRecord = (value: unknown): ApiRecord =>
  isApiRecord(value) ? value : {};

const asApiRecordArray = (value: unknown): ApiRecord[] =>
  Array.isArray(value) ? value.map(asApiRecord) : [];

const mapInvoice = (item: ApiRecord): Invoice => ({
  id: asString(item.id ?? item.idFactura, ''),
  numero: asString(item.numero ?? item.numeroFactura ?? item.numeroFacturaId, 'N/A'),
  fecha: asString(item.fecha ?? item.fechaFactura ?? item.fechaEmision, ''),
  total: asNumber(item.total ?? item.total_final ?? item.subtotal, 0),
  estado: (asString(
    item.estado ?? item.estadoFactura ?? item.estadoVenta,
    'Pendiente',
  ) as Invoice['estado']),
});

const calculateTotals = (facturas: Invoice[]): { totalFacturado: number; totalPagado: number; totalPendiente: number } => {
  const totalFacturado = facturas.reduce((acc, inv) => acc + inv.total, 0);
  const totalPagado = facturas.reduce(
    (acc, inv) => acc + (inv.estado.toLowerCase() === 'pagada' ? inv.total : 0),
    0,
  );
  const totalPendiente = facturas.reduce(
    (acc, inv) => acc + (inv.estado.toLowerCase() !== 'pagada' ? inv.total : 0),
    0,
  );
  return { totalFacturado, totalPagado, totalPendiente };
};

const mapClient = (item: ApiRecord): Client => {
  const tipoClienteObject = isApiRecord(item.tipoCliente) ? item.tipoCliente : null;
  let tipoClienteValue = item.tipoCliente ?? item.tipo ?? item.tipoClienteId;
  if (tipoClienteObject) {
    tipoClienteValue = tipoClienteObject.nombre ?? tipoClienteObject.id ?? tipoClienteValue;
  }

  const resolvedType = resolveClientType(tipoClienteValue, tipoClienteObject?.id ?? item.tipoClienteId ?? item.tipo);

  return {
    id: asString(item.id ?? item.idCliente, ''),
    nombreCompleto: asString(item.nombreCompleto ?? item.nombre, ''),
    identificacion: asString(item.identificacion ?? item.dni ?? item.cedula, ''),
    telefono: asString(item.telefono ?? item.phone, ''),
    correo: asString(item.correo ?? item.email, ''),
    direccion: asString(item.direccion ?? item.address, ''),
    tipoClienteId: resolvedType.tipoClienteId,
    tipoCliente: resolvedType.tipoCliente,
  };
};

const mapClientDetail = (item: ApiRecord): ClientDetail => {
  const base = mapClient(item);
  const rawFacturas = Array.isArray(item.facturas)
    ? asApiRecordArray(item.facturas)
    : asApiRecordArray(item.invoices);
  const facturas = rawFacturas.map(mapInvoice);
  const totals = calculateTotals(facturas);
  const detalle: ClientDetail = {
    ...base,
    totalFacturado: asNumber(item.totalFacturado, totals.totalFacturado),
    totalPagado: asNumber(item.totalPagado, totals.totalPagado),
    totalPendiente: asNumber(item.totalPendiente, totals.totalPendiente),
    facturas,
  };
  return detalle;
};

export const getAllClients = async (): Promise<Client[]> => {
  const { data } = await axios.get<ApiListResponse<unknown>>(API_URL);
  const list = asApiRecordArray(data?.data);
  return list.map(mapClient);
};

export const getClient = async (id: string): Promise<ClientDetail> => {
  const { data } = await axios.get<ApiListResponse<unknown> | unknown>(`${API_URL}/${id}`);
  const cliente = asApiRecord(isApiRecord(data) && 'data' in data ? data.data : data);
  return mapClientDetail(cliente);
};

const mapPayloadType = (payload: CreateClientPayload | UpdateClientPayload): number | undefined => {
  if (payload.tipoCliente) {
    return Number(getClientTypeId(payload.tipoCliente));
  }

  const resolvedType = getClientTypeFromValue(payload.tipoClienteId, 'Minorista');
  return Number(getClientTypeId(resolvedType));
};

export const createClient = async (payload: CreateClientPayload): Promise<Client> => {
  const payloadApi: ApiClientPayload = {
    nombreCompleto: payload.nombreCompleto,
    identificacion: payload.identificacion,
    telefono: payload.telefono,
    correo: payload.correo,
    direccion: payload.direccion,
    tipoCliente: payload.tipoCliente,
  };

  const tipoId = mapPayloadType(payload);
  if (tipoId && Number(tipoId) > 0) {
    payloadApi.tipoClienteId = tipoId;
  }

  const { data } = await axios.post<ApiListResponse<unknown> | unknown>(API_URL, payloadApi);
  const cliente = asApiRecord(isApiRecord(data) && 'data' in data ? data.data : data);
  return mapClient(cliente);
};

export const updateClient = async (
  id: string,
  payload: UpdateClientPayload,
): Promise<Client> => {
  const payloadApi: ApiClientPayload = {
    nombreCompleto: payload.nombreCompleto,
    identificacion: payload.identificacion,
    telefono: payload.telefono,
    correo: payload.correo,
    direccion: payload.direccion,
    tipoCliente: payload.tipoCliente,
  };

  const tipoId = mapPayloadType(payload);
  if (tipoId && Number(tipoId) > 0) {
    payloadApi.tipoClienteId = tipoId;
  }

  const { data } = await axios.put<ApiListResponse<unknown> | unknown>(`${API_URL}/${id}`, payloadApi);
  const cliente = asApiRecord(isApiRecord(data) && 'data' in data ? data.data : data);
  return mapClient(cliente);
};
