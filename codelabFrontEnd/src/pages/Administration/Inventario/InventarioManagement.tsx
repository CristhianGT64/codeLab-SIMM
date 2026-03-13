import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import useDashboardInventario from "../../../hooks/InventarioHooks/useDashboardInventario";
import useHistorialInventario from "../../../hooks/InventarioHooks/useHistorialInventario";
import type {
  MovimientoInventarioItem,
  HistorialInventarioFilters,
  FiltroTipo,
} from "../../../interfaces/Inventario/InventarioInterface";
import StatCard from "../../../components/CardsEstadisticosIcon/StatCard";
import {
  botonBorrarFiltro,
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

const ITEMS_POR_PAGINA = 8;

// Mapeo de motivos de salida (enum → texto legible)
const MOTIVOS: Record<string, string> = {
  VENTA: "Venta",
  DANIO: "Daño",
  CONSUMO_INTERNO: "Consumo Interno",
  AJUSTE: "Ajuste",
  OTRO: "Otro",
};

export default function InventarioManagement() {
  const { tienePermiso } = useAuth();
  // ── Filtros 
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<"" | "entrada" | "salida">("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const navigate = useNavigate();

  const [paginaActual, setPaginaActual] = useState(1);

  // ── Datos remotos 
  const filters: HistorialInventarioFilters = {
    ...(tipoFiltro && { tipo: tipoFiltro }),
    ...(fechaFiltro && { fecha: fechaFiltro }),
  };

  const { data: dashboard, isLoading: loadingDash } = useDashboardInventario();
  const { data: historial, isLoading: loadingTable } =
    useHistorialInventario(filters);

  const movimientos: MovimientoInventarioItem[] = historial?.data ?? [];

  // ── Filtrado local por nombre de producto 
  const movimientosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return movimientos;
    return movimientos.filter((m) =>
      m.producto?.nombre.toLowerCase().includes(busqueda.toLowerCase()),
    );
  }, [movimientos, busqueda]);

  // ── Cálculos de paginación 
  const totalPaginas = Math.ceil(
    movimientosFiltrados.length / ITEMS_POR_PAGINA,
  );
  const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const fin = inicio + ITEMS_POR_PAGINA;
  const movimientosPaginados = movimientosFiltrados.slice(inicio, fin);

  const irAPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) setPaginaActual(pagina);
  };

  // Al cambiar un filtro siempre volvemos a la página 1
  const handleBusqueda = (v: string) => {
    setBusqueda(v);
    setPaginaActual(1);
  };
  const handleTipo = (v: string) => {
    setTipoFiltro(v as "" | "entrada" | "salida");
    setPaginaActual(1);
  };
  const handleFecha = (v: string) => {
    setFechaFiltro(v);
    setPaginaActual(1);
  };
  const limpiarFiltros = () => {
    setBusqueda("");
    setTipoFiltro("");
    setFechaFiltro("");
    setPaginaActual(1);
  };

  const proveedorOMotivo = (m: MovimientoInventarioItem) => {
    if (m.tipo === "entrada") return m.proveedor?.nombre ?? "—";
    if (m.detalleMotivo) return m.detalleMotivo;
    if (m.motivoSalida) return MOTIVOS[m.motivoSalida] ?? m.motivoSalida;
    return "—";
  };

  const contenidoTabla = (() => {
    if (loadingTable) {
      return (
        <tr>
          <td colSpan={7} className="text-center py-12 text-[#6b7a8f]">
            Cargando movimientos…
          </td>
        </tr>
      );
    }

    if (movimientosPaginados.length === 0) {
      return (
        <tr>
          <td colSpan={7} className="text-center py-12 text-[#6b7a8f]">
            Sin movimientos registrados
          </td>
        </tr>
      );
    }

    return movimientosPaginados.map((m, i) => (
      <tr
        key={m.id}
        className={`border-b border-gray-100 hover:bg-[#f0f6ff] transition-colors ${
          i % 2 === 0 ? "bg-white" : "bg-gray-50/60"
        }`}
      >
        {/* Fecha */}
        <td className="px-4 py-3 text-[#24364d] whitespace-nowrap">
          {formatFecha(m.fechaMovimiento)}
        </td>

        {/* Producto */}
        <td className="px-4 py-3 font-medium text-[#0b4d77]">
          {m.producto?.nombre ?? "-"}
        </td>

        {/* Tipo */}
        <td className="px-4 py-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
              m.tipo === "entrada"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {m.tipo === "entrada" ? "↗" : "↘"}{" "}
            {m.tipo === "entrada" ? "Entrada" : "Salida"}
          </span>
        </td>

        {/* Cantidad */}
        <td
          className={`px-4 py-3 font-semibold ${
            m.tipo === "entrada" ? "text-green-600" : "text-red-500"
          }`}
        >
          {m.tipo === "entrada" ? `+${m.cantidad}` : `-${m.cantidad}`}
        </td>

        {/* Proveedor / Motivo */}
        <td className="px-4 py-3 text-[#4661b0]">{proveedorOMotivo(m)}</td>

        {/* Stock Resultante */}
        <td className="px-4 py-3 font-medium text-[#24364d]">
          {m.stockResultante}
        </td>

        {/* Estado */}
        <td className="px-4 py-3">
          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            {m.estado}
          </span>
        </td>
      </tr>
    ));
  })();

  return (
    <section className="px-6 py-8">
      {/* Título */}
      <HeaderTitleAdmin {...titleInventario} />

      {/* Botones de acción */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        {tienePermiso("Registrar Entradas") && (
          <ButtonsComponet
            {...botonRegistrarEntrada}
            onClick={() =>
              navigate("/Inventario-Management/Entrada-Inventario")
            }
          />
        )}

        {tienePermiso("Registrar Salidas") && (
          <ButtonsComponet
            {...botonRegistrarSalida}
            onClick={() => navigate("/Inventario-Management/Salida-Inventario")}
          />
        )}
      </div>

      {/* Cards de estadísticas */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total de Productos"
          value={loadingDash ? "…" : (dashboard?.data.totalProductos ?? 0)}
          valueColor="text-[#24364d]"
          icon="box"
        />
        <StatCard
          label="Stock Total"
          value={loadingDash ? "…" : (dashboard?.data.stockTotal ?? 0)}
          valueColor="text-[#24364d]"
          icon="box"
        />
        <StatCard
          label="Entradas del Día"
          value={loadingDash ? "…" : (dashboard?.data.entradasDelDia ?? 0)}
          valueColor="text-green-600"
          icon="up"
        />
        <StatCard
          label="Salidas del Día"
          value={loadingDash ? "…" : (dashboard?.data.salidasDelDia ?? 0)}
          valueColor="text-red-500"
          icon="down"
        />
      </div>

      {/* Filtros */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Búsqueda */}
        <div className="relative flex-1 min-w-0">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
            <svg
              className="w-4 h-4"
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
            onChange={(e) => handleBusqueda(e.target.value)}
            placeholder="Buscar por producto..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4661b0]/25"
          />
        </div>

        {/* Tipo */}
        <select
          value={tipoFiltro}
          onChange={(e) => handleTipo(e.target.value)}
          className="py-2.5 px-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4661b0]/25"
        >
          {filtroTipo.map((filtro: FiltroTipo) => (
            <option key={filtro.valor} value={filtro.valor}>
              {filtro.nombre}
            </option>
          ))}
        </select>

        {/* Fecha */}
        <input
          type="date"
          value={fechaFiltro}
          onChange={(e) => handleFecha(e.target.value)}
          className="py-2.5 px-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4661b0]/25"
        />

        <ButtonsComponet
          {...botonBorrarFiltro}
          onClick={limpiarFiltros}
        />
      </div>

      {/* Tabla */}
      <TableComponent
        tituloTablaInventario={tituloTablaInventario}
        contenidoTabla={contenidoTabla}
      />

      {totalPaginas > 1 && (
        <PaginacionComponent
          inicio={inicio}
          fin={fin}
          registros={movimientosFiltrados}
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          action={irAPagina}
        />
      )}
    </section>
  );
}
