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

const mapInvoice = (item: any): Invoice => ({
  id: String(item.id ?? item.idFactura ?? ''),
  numero: String(item.numero ?? item.numeroFactura ?? item.numeroFacturaId ?? 'N/A'),
  fecha: item.fecha ?? item.fechaFactura ?? item.fechaEmision ?? '',
  total: Number(item.total ?? item.total_final ?? item.subtotal ?? 0),
  estado: item.estado ?? item.estadoFactura ?? item.estadoVenta ?? 'Pendiente',
});

const calculateTotals = (facturas: any[]): { totalFacturado: number; totalPagado: number; totalPendiente: number } => {
  const normalized = facturas.map(mapInvoice);
  const totalFacturado = normalized.reduce((acc, inv) => acc + (Number(inv.total) || 0), 0);
  const totalPagado = normalized.reduce((acc, inv) => acc + ((inv.estado?.toLowerCase() === 'pagada' ? Number(inv.total) : 0) || 0), 0);
  const totalPendiente = normalized.reduce((acc, inv) => acc + ((inv.estado?.toLowerCase() !== 'pagada' ? Number(inv.total) : 0) || 0), 0);
  return { totalFacturado, totalPagado, totalPendiente };
};

const mapClient = (item: any): Client => {
  const tipoClienteObject = item.tipoCliente;
  let tipoClienteValue = item.tipoCliente ?? item.tipo ?? item.tipoClienteId;
  if (tipoClienteObject && typeof tipoClienteObject === 'object') {
    tipoClienteValue = tipoClienteObject.nombre ?? tipoClienteObject.id ?? tipoClienteValue;
  }

  const resolvedType = resolveClientType(tipoClienteValue, tipoClienteObject?.id ?? item.tipoClienteId ?? item.tipo);

  return {
    id: String(item.id ?? item.idCliente ?? ''),
    nombreCompleto: item.nombreCompleto ?? item.nombre ?? '',
    identificacion: item.identificacion ?? item.dni ?? item.cedula ?? '',
    telefono: item.telefono ?? item.phone ?? '',
    correo: item.correo ?? item.email ?? '',
    direccion: item.direccion ?? item.address ?? '',
    tipoClienteId: resolvedType.tipoClienteId,
    tipoCliente: resolvedType.tipoCliente,
  };
};

const mapClientDetail = (item: any): ClientDetail => {
  const base = mapClient(item);
  const rawFacturas = Array.isArray(item.facturas)
    ? item.facturas
    : Array.isArray(item.invoices)
    ? item.invoices
    : [];
  const facturas = rawFacturas.map(mapInvoice);
  const totals = calculateTotals(facturas);
  const detalle: ClientDetail = {
    ...base,
    totalFacturado: Number(item.totalFacturado ?? totals.totalFacturado ?? 0),
    totalPagado: Number(item.totalPagado ?? totals.totalPagado ?? 0),
    totalPendiente: Number(item.totalPendiente ?? totals.totalPendiente ?? 0),
    facturas,
  };
  return detalle;
};

export const getAllClients = async (): Promise<Client[]> => {
  const { data } = await axios.get(API_URL);
  const list = Array.isArray(data?.data) ? data.data : [];
  return list.map(mapClient);
};

export const getClient = async (id: string): Promise<ClientDetail> => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  const cliente = data?.data ?? data;
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
  const payloadApi: any = {
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

  const { data } = await axios.post(API_URL, payloadApi);
  const cliente = data?.data ?? data;
  return mapClient(cliente);
};

export const updateClient = async (
  id: string,
  payload: UpdateClientPayload,
): Promise<Client> => {
  const payloadApi: any = {
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

  const { data } = await axios.put(`${API_URL}/${id}`, payloadApi);
  const cliente = data?.data ?? data;
  return mapClient(cliente);
};
