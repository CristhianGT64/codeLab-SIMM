import settings from "../lib/settings";
import type {
  AlertasInventarioResponse,
  DashboardInventarioResponse,
  HistorialInventarioFilters,
  HistorialInventarioResponse,
  HistorialProductoResponse,
  MotivosSalidaResponse,
  MovimientoInventarioResponse,
  ProductosBajoStockResponse,
  RegistrarEntradaForm,
  RegistrarSalidaForm,
  TiposEntradaResponse,
} from "../interfaces/Inventario/InventarioInterface";

const buildQueryParams = (params: Record<string, string | undefined>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const getDashboardInventario =
  async (sucursalId?: string): Promise<DashboardInventarioResponse> => {
    const query = buildQueryParams({ sucursalId });

    const response = await fetch(`${settings.URL}/inventario/dashboard${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const payload = (await response.json()) as DashboardInventarioResponse;

    if (!response.ok) {
      throw new Error("No se pudo obtener el dashboard de inventario");
    }

    return payload;
  };

export const getTiposEntrada = async (): Promise<TiposEntradaResponse> => {
  const response = await fetch(`${settings.URL}/inventario/tipos-entrada`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as TiposEntradaResponse;

  if (!response.ok) {
    throw new Error("No se pudieron obtener los tipos de entrada");
  }

  return payload;
};

export const getProductosBajoStock = async (
  sucursalId?: string,
): Promise<ProductosBajoStockResponse> => {
  const query = buildQueryParams({ sucursalId });

  const response = await fetch(
    `${settings.URL}/inventario/productos-bajo-stock${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const payload = (await response.json()) as ProductosBajoStockResponse;

  if (!response.ok) {
    throw new Error("No se pudo obtener la lista de productos con bajo inventario");
  }

  return payload;
};

export const getAlertasInventario = async (
  sucursalId?: string,
): Promise<AlertasInventarioResponse> => {
  const query = buildQueryParams({ sucursalId });

  const response = await fetch(`${settings.URL}/alertas/inventario${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as AlertasInventarioResponse;

  if (!response.ok) {
    throw new Error("No se pudieron obtener las alertas de inventario");
  }

  return payload;
};

export const getMotivosSalida = async (): Promise<MotivosSalidaResponse> => {
  const response = await fetch(`${settings.URL}/inventario/motivos-salida`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as MotivosSalidaResponse;

  if (!response.ok) {
    throw new Error("No se pudieron obtener los motivos de salida");
  }

  return payload;
};

export const registrarEntrada = async (
  credentials: RegistrarEntradaForm,
): Promise<boolean> => {
  const response = await fetch(`${settings.URL}/inventario/entrada`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const payload =
    (await response.json()) as MovimientoInventarioResponse | { success?: boolean };

  if (!response.ok) {
    throw new Error("No se pudo registrar la entrada");
  }

  return Boolean(payload?.success);
};

export const registrarSalida = async (
  credentials: RegistrarSalidaForm,
): Promise<boolean> => {
  const response = await fetch(`${settings.URL}/inventario/salida`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const payload =
    (await response.json()) as MovimientoInventarioResponse | { success?: boolean };

  if (!response.ok) {
    throw new Error("No se pudo registrar la salida");
  }

  return Boolean(payload?.success);
};

export const getHistorialInventario = async (
  filters: HistorialInventarioFilters = {},
): Promise<HistorialInventarioResponse> => {
  const query = buildQueryParams({
    tipo: filters.tipo,
    productoId: filters.productoId,
    sucursalId: filters.sucursalId,
    fecha: filters.fecha,
    fechaDesde: filters.fechaDesde,
    fechaHasta: filters.fechaHasta,
  });

  const response = await fetch(`${settings.URL}/inventario/historial${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as HistorialInventarioResponse;

  if (!response.ok) {
    throw new Error("No se pudo obtener el historial de inventario");
  }

  return payload;
};

export const getHistorialProducto = async ({
  productoId,
  sucursalId,
}: {
  productoId: string;
  sucursalId: string;
}): Promise<HistorialProductoResponse> => {
  const query = buildQueryParams({ sucursalId });

  const response = await fetch(
    `${settings.URL}/inventario/historial/${productoId}${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const payload = (await response.json()) as HistorialProductoResponse;

  if (!response.ok) {
    throw new Error("No se pudo obtener el historial del producto");
  }

  return payload;
};
