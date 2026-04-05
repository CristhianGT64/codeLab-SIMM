export interface VentaClienteResumen {
  id: string;
  nombreCompleto: string | null;
  identificacion: string | null;
}

export interface VentaUsuarioResumen {
  id: string;
  nombreCompleto: string | null;
  usuario: string | null;
}

export interface VentaSucursalResumen {
  id: string;
  nombre: string | null;
}

export interface VentaHistorialDetalleItem {
  id: string;
  productoId: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface VentaProductoDetalle {
  id: string;
  nombre: string | null;
  sku: string | null;
  precioVenta: number;
  unidadMedida: string | null;
}

export interface VentaDetalleItem extends VentaHistorialDetalleItem {
  producto: VentaProductoDetalle | null;
}

export interface VentaHistorialItem {
  id: string;
  total: number;
  subtotal: number;
  estado: string;
  createdAt: string | null;
  clienteId: string | null;
  usuarioId: string;
  sucursalId: string;
  nombreUsuario: string | null;
  nombreSucursal: string | null;
  cliente: VentaClienteResumen | null;
  productosCount: number;
  detalles: VentaHistorialDetalleItem[];
}

export interface VentaDetalle extends Omit<VentaHistorialItem, "detalles"> {
  usuario: VentaUsuarioResumen | null;
  sucursal: VentaSucursalResumen | null;
  detalles: VentaDetalleItem[];
}
