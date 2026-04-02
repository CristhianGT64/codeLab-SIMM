import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import useDashboardInventario from "../../../hooks/InventarioHooks/useDashboardInventario";
import useHistorialInventario from "../../../hooks/InventarioHooks/useHistorialInventario";
import useProductosBajoStock from "../../../hooks/InventarioHooks/useProductosBajoStock";
import useAlertasInventario from "../../../hooks/InventarioHooks/useAlertasInventario";
import type {
  FiltroTipo,
  HistorialInventarioFilters,
  MovimientoInventarioItem,
} from "../../../interfaces/Inventario/InventarioInterface";
import StatCard from "../../../components/CardsEstadisticosIcon/StatCard";
import {
  botonBorrarFiltro,
  botonFifoPromedio,
  botonRegistrarEntrada,
  botonRegistrarSalida,
  filtroTipo,
  titleInventario,
  tituloTablaInventario,
} from "../../../data/dataAdministrator/InventarioData";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";
import useAuth from "../../../hooks/useAuth";
import { formatFecha } from "../../../lib/settings";
import TableComponent from "../../../components/Table/TableComponent";
import PaginacionComponent from "../../../components/Paginacion/PaginacionComponent";
import useListProduct from "../../../hooks/ProductosHooks/useListProduct";
import useUpdateStockMinimo from "../../../hooks/ProductosHooks/useUpdateStockMinimo";
import StatusNotification from "../../../components/notifications/StatusNotification";

const ITEMS_POR_PAGINA = 8;

const MOTIVOS: Record<string, string> = {
  VENTA: "Venta",
  DANIO: "Daño",
  CONSUMO_INTERNO: "Consumo Interno",
  AJUSTE: "Ajuste",
  OTRO: "Otro",
};

type NotificationState = {
  isVisible: boolean;
  variant: "success" | "error";
  title: string;
  message: string;
};

export default function InventarioOverview() {
  const navigate = useNavigate();
  const { user, tienePermiso } = useAuth();
  const sucursalId = user?.sucursal.id;

  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<"" | "entrada" | "salida">("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [stockMinimoInput, setStockMinimoInput] = useState("0");
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    variant: "success",
    title: "",
    message: "",
  });

  const filters: HistorialInventarioFilters = {
    ...(tipoFiltro && { tipo: tipoFiltro }),
    ...(fechaFiltro && { fecha: fechaFiltro }),
    ...(sucursalId && { sucursalId }),
  };

  const { data: dashboard, isLoading: loadingDash } = useDashboardInventario(
    sucursalId,
  );
  const { data: historial, isLoading: loadingTable } =
    useHistorialInventario(filters);
  const { data: alertasData } = useAlertasInventario(sucursalId);
  const { data: bajoStockData } = useProductosBajoStock(sucursalId);
  const { data: productData } = useListProduct();
  const { mutateAsync: updateStockMinimo, isPending: isUpdatingStockMinimo } =
    useUpdateStockMinimo();

  const productos = productData?.data ?? [];
  const alertas = alertasData?.data ?? [];
  const productosBajoStock = bajoStockData?.data ?? [];
  const movimientos = useMemo<MovimientoInventarioItem[]>(
    () => historial?.data ?? [],
    [historial?.data],
  );

  const selectedProduct = useMemo(
    () => productos.find((product) => product.id === selectedProductId) ?? null,
    [productos, selectedProductId],
  );

  useEffect(() => {
    if (!selectedProductId && productos.length > 0) {
      setSelectedProductId(productos[0].id);
    }
  }, [productos, selectedProductId]);

  useEffect(() => {
    if (selectedProduct) {
      setStockMinimoInput(String(selectedProduct.stockMinimo ?? 0));
    }
  }, [selectedProduct]);

  const movimientosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return movimientos;

    const search = busqueda.toLowerCase();
    return movimientos.filter((m) =>
      m.producto?.nombre.toLowerCase().includes(search),
    );
  }, [movimientos, busqueda]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(movimientosFiltrados.length / ITEMS_POR_PAGINA),
  );
  const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const fin = inicio + ITEMS_POR_PAGINA;
  const movimientosPaginados = movimientosFiltrados.slice(inicio, fin);

  const proveedorOMotivo = (movimiento: MovimientoInventarioItem) => {
    if (movimiento.tipo === "entrada") {
      return movimiento.proveedor?.nombre ?? "—";
    }

    if (movimiento.detalleMotivo) {
      return movimiento.detalleMotivo;
    }

    if (movimiento.motivoSalida) {
      return MOTIVOS[movimiento.motivoSalida] ?? movimiento.motivoSalida;
    }

    return "—";
  };

  const contenidoTabla = (() => {
    if (loadingTable) {
      return (
        <tr>
          <td colSpan={7} className="py-12 text-center text-[#6b7a8f]">
            Cargando movimientos...
          </td>
        </tr>
      );
    }

    if (movimientosPaginados.length === 0) {
      return (
        <tr>
          <td colSpan={7} className="py-12 text-center text-[#6b7a8f]">
            Sin movimientos registrados
          </td>
        </tr>
      );
    }

    return movimientosPaginados.map((movimiento, index) => (
      <tr
        key={movimiento.id}
        className={`border-b border-gray-100 transition-colors hover:bg-[#f0f6ff] ${
          index % 2 === 0 ? "bg-white" : "bg-gray-50/60"
        }`}
      >
        <td className="whitespace-nowrap px-6 py-4 text-[#24364d]">
          {formatFecha(movimiento.fechaMovimiento)}
        </td>
        <td className="px-6 py-4 font-medium text-[#0b4d77]">
          {movimiento.producto?.nombre ?? "-"}
        </td>
        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              movimiento.tipo === "entrada"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {movimiento.tipo === "entrada" ? "↗" : "↘"}{" "}
            {movimiento.tipo === "entrada" ? "Entrada" : "Salida"}
          </span>
        </td>
        <td
          className={`px-6 py-4 font-semibold ${
            movimiento.tipo === "entrada" ? "text-green-600" : "text-red-500"
          }`}
        >
          {movimiento.tipo === "entrada"
            ? `+${movimiento.cantidad}`
            : `-${movimiento.cantidad}`}
        </td>
        <td className="px-6 py-4 text-[#4661b0]">
          {proveedorOMotivo(movimiento)}
        </td>
        <td className="px-6 py-4 font-medium text-[#24364d]">
          {movimiento.stockResultante}
        </td>
        <td className="px-6 py-4">
          <span className="inline-block rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
            {movimiento.estado}
          </span>
        </td>
      </tr>
    ));
  })();

  const currentStock = selectedProduct
    ? selectedProduct.inventarios.reduce(
        (acc, inventario) => acc + inventario.stockActual,
        0,
      )
    : 0;

  const handleGuardarStockMinimo = async () => {
    if (!selectedProduct) {
      setNotification({
        isVisible: true,
        variant: "error",
        title: "Producto no seleccionado",
        message: "Selecciona un producto para configurar el stock mínimo.",
      });
      return;
    }

    const normalized = Number(stockMinimoInput);

    if (!Number.isInteger(normalized) || normalized < 0) {
      setNotification({
        isVisible: true,
        variant: "error",
        title: "Valor inválido",
        message: "El stock mínimo debe ser un número entero mayor o igual a 0.",
      });
      return;
    }

    try {
      await updateStockMinimo({
        id: selectedProduct.id,
        stockMinimo: normalized,
      });

      setNotification({
        isVisible: true,
        variant: "success",
        title: "Stock mínimo actualizado",
        message: `El producto "${selectedProduct.nombre}" ahora alertará en ${normalized} unidades o menos.`,
      });
    } catch (error) {
      setNotification({
        isVisible: true,
        variant: "error",
        title: "No se pudo actualizar",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo guardar el stock mínimo.",
      });
    }
  };

  const canViewEntry =
    tienePermiso("Entrada inventario") || tienePermiso("Registrar Entradas");
  const canViewExit =
    tienePermiso("Salida inventario") || tienePermiso("Registrar Salidas");
  const canViewConfig =
    tienePermiso("Movimientos inventario") ||
    tienePermiso("Configuracion FIFO/Promedio");

  return (
    <section className="px-6 py-8">
      <HeaderTitleAdmin {...titleInventario} />

      <StatusNotification
        isVisible={notification.isVisible}
        variant={notification.variant}
        title={notification.title}
        message={notification.message}
        onClose={() =>
          setNotification((prev) => ({ ...prev, isVisible: false }))
        }
      />

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        {canViewEntry && (
          <ButtonsComponet
            {...botonRegistrarEntrada}
            onClick={() => navigate("/Inventario-Management/Entrada-Inventario")}
          />
        )}

        {canViewExit && (
          <ButtonsComponet
            {...botonRegistrarSalida}
            onClick={() => navigate("/Inventario-Management/Salida-Inventario")}
          />
        )}

        <ButtonsComponet
          text="Productos Bajo Stock"
          typeButton="button"
          className="flex-1 cursor-pointer rounded-xl border-2 border-[#f6c168] bg-[#fff7e6] px-6 py-3 text-base font-semibold text-[#a15c00] transition-all duration-200 hover:bg-[#ffefc9]"
          icon="fa-solid fa-triangle-exclamation"
          onClick={() => navigate("/Inventario-Management/Productos-Bajo-Stock")}
          disabled={false}
        />

        {canViewConfig && (
          <ButtonsComponet
            {...botonFifoPromedio}
            onClick={() => navigate("/Configuracion/Inventario/FIFO-PEPS")}
          />
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-5">
        <StatCard
          label="Total de Productos"
          value={loadingDash ? "..." : dashboard?.data.totalProductos ?? 0}
          valueColor="text-[#24364d]"
          icon="box"
        />
        <StatCard
          label="Stock Total"
          value={loadingDash ? "..." : dashboard?.data.stockTotal ?? 0}
          valueColor="text-[#24364d]"
          icon="box"
        />
        <StatCard
          label="Entradas del Día"
          value={loadingDash ? "..." : dashboard?.data.entradasDelDia ?? 0}
          valueColor="text-green-600"
          icon="up"
        />
        <StatCard
          label="Salidas del Día"
          value={loadingDash ? "..." : dashboard?.data.salidasDelDia ?? 0}
          valueColor="text-red-500"
          icon="down"
        />
        <StatCard
          label="Alertas Activas"
          value={loadingDash ? "..." : dashboard?.data.alertasActivas ?? 0}
          valueColor="text-[#c2410c]"
          icon="alert"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-[#f2d59b] bg-linear-to-r from-[#fff6dd] to-[#fffaf0] p-5 shadow-[0_6px_18px_rgba(161,92,0,0.08)]">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#a15c00]">
                Alerta de inventario
              </p>
              <h3 className="mt-1 text-2xl font-bold text-[#6c3f00]">
                {alertas.length > 0
                  ? `${alertas.length} alerta${alertas.length === 1 ? "" : "s"} activa${alertas.length === 1 ? "" : "s"}`
                  : "Sin alertas activas"}
              </h3>
              <p className="mt-2 text-sm text-[#8b5e1a]">
                El sistema marca automáticamente los productos cuyo stock actual es igual o menor al mínimo configurado.
              </p>
            </div>
            {productosBajoStock.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-[#fff1c7] px-3 py-1 text-sm font-semibold text-[#8b5e1a]">
                {productosBajoStock.length} producto{productosBajoStock.length === 1 ? "" : "s"} con bajo inventario
              </span>
            )}
          </div>

          {alertas.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {alertas.slice(0, 3).map((alerta) => (
                <div
                  key={alerta.id}
                  className="rounded-xl border border-[#f4c36b] bg-white px-4 py-3 text-sm text-[#6c3f00]"
                >
                  <p className="font-semibold">{alerta.producto.nombre}</p>
                  <p className="mt-1">
                    Stock actual: <span className="font-bold">{alerta.stockActual}</span> | Mínimo:{" "}
                    <span className="font-bold">{alerta.stockMinimo}</span>
                  </p>
                  <p className="mt-1 text-xs text-[#94631c]">{alerta.mensaje}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl bg-white/80 px-4 py-4 text-sm text-[#8b6b37]">
              No hay productos por debajo del stock mínimo en esta sucursal.
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-[#f4f6f8] p-5 shadow-[0_6px_18px_rgba(10,64,89,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#4661b0]">
            Configurar stock mínimo
          </p>
          <h3 className="mt-1 text-2xl font-bold text-[#24364d]">
            Ajuste rápido por producto
          </h3>
          <p className="mt-2 text-sm text-[#6b7a8f]">
            Define el nivel mínimo desde esta pantalla para activar las alertas automáticas del inventario.
          </p>

          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#0a4d76]">Producto</span>
              <select
                value={selectedProductId}
                onChange={(event) => setSelectedProductId(event.target.value)}
                className="h-12 rounded-xl border border-[#9adce2] bg-white px-4 text-base text-[#24364d] outline-none focus:border-[#0aa6a2]"
              >
                {productos.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.nombre}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-white px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6b7a8f]">
                  Stock actual
                </p>
                <p className="mt-1 text-2xl font-bold text-[#24364d]">
                  {currentStock}
                </p>
              </div>
              <div className="rounded-xl bg-white px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6b7a8f]">
                  Mínimo vigente
                </p>
                <p className="mt-1 text-2xl font-bold text-[#4661b0]">
                  {selectedProduct?.stockMinimo ?? 0}
                </p>
              </div>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#0a4d76]">
                Nuevo stock mínimo
              </span>
              <input
                type="number"
                min="0"
                value={stockMinimoInput}
                onChange={(event) => setStockMinimoInput(event.target.value)}
                className="h-12 rounded-xl border border-[#9adce2] bg-white px-4 text-base text-[#24364d] outline-none focus:border-[#0aa6a2]"
              />
            </label>

            <ButtonsComponet
              text={isUpdatingStockMinimo ? "Guardando..." : "Guardar stock mínimo"}
              typeButton="button"
              className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] px-5 text-base font-semibold text-white hover:from-[#06706d] hover:to-[#334c8b] disabled:cursor-not-allowed disabled:opacity-70"
              icon="fa-solid fa-floppy-disk"
              onClick={handleGuardarStockMinimo}
              disabled={isUpdatingStockMinimo || productos.length === 0}
            />
          </div>
        </div>
      </div>

      {productosBajoStock.length > 0 && (
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-[0_6px_18px_rgba(10,64,89,0.08)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#c2410c]">
                Productos con bajo inventario
              </p>
              <h3 className="mt-1 text-xl font-bold text-[#24364d]">
                Resumen de productos comprometidos
              </h3>
            </div>
            <ButtonsComponet
              text="Ver listado completo"
              typeButton="button"
              className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#f4c36b] bg-[#fff7e6] px-4 text-sm font-semibold text-[#a15c00] hover:bg-[#ffefc9]"
              icon="fa-solid fa-list"
              onClick={() => navigate("/Inventario-Management/Productos-Bajo-Stock")}
              disabled={false}
            />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {productosBajoStock.slice(0, 3).map((item) => (
              <div
                key={item.inventarioId}
                className="rounded-xl border border-[#f1d5b5] bg-[#fffaf5] p-4"
              >
                <p className="text-base font-bold text-[#24364d]">
                  {item.producto.nombre}
                </p>
                <p className="mt-1 text-sm text-[#6b7a8f]">{item.producto.sku}</p>
                <p className="mt-3 text-sm text-[#8b5e1a]">
                  Stock actual: <span className="font-semibold">{item.stockActual}</span>
                </p>
                <p className="text-sm text-[#8b5e1a]">
                  Stock mínimo: <span className="font-semibold">{item.stockMinimo}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            value={busqueda}
            onChange={(event) => {
              setBusqueda(event.target.value);
              setPaginaActual(1);
            }}
            placeholder="Buscar por producto..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4661b0]/25"
          />
        </div>

        <select
          value={tipoFiltro}
          onChange={(event) => {
            setTipoFiltro(event.target.value as "" | "entrada" | "salida");
            setPaginaActual(1);
          }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4661b0]/25"
        >
          {filtroTipo.map((filtroItem: FiltroTipo) => (
            <option key={filtroItem.valor} value={filtroItem.valor}>
              {filtroItem.nombre}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={fechaFiltro}
          onChange={(event) => {
            setFechaFiltro(event.target.value);
            setPaginaActual(1);
          }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4661b0]/25"
        />

        <ButtonsComponet
          {...botonBorrarFiltro}
          onClick={() => {
            setBusqueda("");
            setTipoFiltro("");
            setFechaFiltro("");
            setPaginaActual(1);
          }}
        />
      </div>

      <TableComponent
        tituloTablaInventario={tituloTablaInventario}
        contenidoTabla={contenidoTabla}
      />

      <PaginacionComponent
        inicio={inicio}
        fin={fin}
        registros={movimientosFiltrados}
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        action={(pagina: number) => setPaginaActual(pagina)}
      />
    </section>
  );
}
