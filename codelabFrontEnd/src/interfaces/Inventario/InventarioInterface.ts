export interface ProductoMini {
  id: string;
  nombre: string;
  sku: string;
}

export interface SucursalMini {
  id: string;
  nombre: string;
}

export interface ProveedorMini {
  id: string;
  nombre: string;
}

export interface MovimientoInventarioItem {
  id: string;
  tipo: "entrada" | "salida";
  subtipoEntrada: "PRODUCTO_NUEVO" | "REABASTECIMIENTO" | null;
  motivoSalida: "VENTA" | "DANIO" | "CONSUMO_INTERNO" | "AJUSTE" | "OTRO" | null;
  detalleMotivo: string | null;
  observaciones: string | null;
  cantidad: number;
  stockResultante: number;
  metodoValuacionAplicado?: "FIFO" | "PROMEDIO_PONDERADO" | null;
  costoUnitario?: number | null;
  costoTotal?: number | null;
  fechaMovimiento: string;
  estado: string;
  producto?: ProductoMini;
  sucursal?: SucursalMini;
  proveedor?: ProveedorMini | null;
}

export interface HistorialInventarioResponse {
  success: boolean;
  data: MovimientoInventarioItem[];
}

export interface HistorialProductoData {
  producto: ProductoMini;
  sucursal: SucursalMini;
  stockActual: number;
  movimientos: MovimientoInventarioItem[];
}

export interface HistorialProductoResponse {
  success: boolean;
  data: HistorialProductoData;
}

export interface DashboardInventarioData {
  totalProductos: number;
  stockTotal: number;
  entradasDelDia: number;
  salidasDelDia: number;
  productosBajoStock: number;
  alertasActivas: number;
}

export interface DashboardInventarioResponse {
  success: boolean;
  data: DashboardInventarioData;
}

export interface RegistrarEntradaForm {
  productoId: string;
  sucursalId: string;
  tipoEntrada: "PRODUCTO_NUEVO" | "REABASTECIMIENTO";
  cantidad: number;
  fechaHora: string;
  proveedorId: string;
  observaciones?: string;
  usuarioId : string
}


export interface RegistrarSalidaForm {
  productoId: string;
  sucursalId: string;
  motivoSalida: "VENTA" | "DANIO" | "CONSUMO_INTERNO" | "AJUSTE" | "OTRO";
  detalleMotivo: string;
  cantidad: number;
  fechaHora: string;
  observaciones?: string;
  usuarioId : string
}

export interface MovimientoInventarioResponse {
  success: boolean;
  message: string;
  data: {
    movimiento: MovimientoInventarioItem;
    inventario: {
      id: string;
      stockActual: number;
      productoId: string;
      sucursalId: string;
    };
  };
}

export interface TiposEntradaResponse {
  success: boolean;
  data: Array<"PRODUCTO_NUEVO" | "REABASTECIMIENTO">;
}

export interface MotivosSalidaResponse {
  success: boolean;
  data: Array<"VENTA" | "DANIO" | "CONSUMO_INTERNO" | "AJUSTE" | "OTRO">;
}

export interface HistorialInventarioFilters {
  tipo?: "entrada" | "salida";
  productoId?: string;
  sucursalId?: string;
  fecha?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface FiltroTipo {
  valor : string | number
  nombre : string
}

export interface ProductoBajoStockItem {
  inventarioId: string;
  productoId: string;
  producto: {
    id: string;
    nombre: string;
    sku: string;
    unidadMedida: string | null;
    stockMinimo: number;
  };
  sucursal: SucursalMini;
  stockActual: number;
  stockMinimo: number;
}

export interface ProductosBajoStockResponse {
  success: boolean;
  data: ProductoBajoStockItem[];
}

export interface AlertaInventarioItem {
  id: string;
  inventarioId: string;
  productoId: string;
  sucursalId: string;
  stockActual: number;
  stockMinimo: number;
  activa: boolean;
  mensaje: string;
  createdAt: string;
  updatedAt: string;
  resueltaAt: string | null;
  producto: {
    id: string;
    nombre: string;
    sku: string;
    unidadMedida: string | null;
  };
  sucursal: SucursalMini;
}

export interface AlertasInventarioResponse {
  success: boolean;
  data: AlertaInventarioItem[];
}
