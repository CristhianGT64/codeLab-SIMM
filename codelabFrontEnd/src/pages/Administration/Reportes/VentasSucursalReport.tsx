import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faBuilding,
  faCalendarDays,
  faChartLine,
  faCoins,
  faFilter,
  faShop,
  faTimeline,
} from "@fortawesome/free-solid-svg-icons";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import PaginacionComponent from "../../../components/Paginacion/PaginacionComponent";
import useVentasSucursalReport from "../../../hooks/ReportesHooks/useVentasSucursalReport";
import useListSucursales from "../../../hooks/SucursalesHooks/useListSucursales";
import type { HeaderAdmin } from "../../../interfaces/Headers/HeaderInterface";
import type {
  ReporteVentasSucursalItem,
  ReporteVentasSucursalResponse,
} from "../../../interfaces/Reportes/VentasSucursalReportInterface";
import type { Sucursal } from "../../../interfaces/Sucursales/SucursalInterface";

const ITEMS_POR_PAGINA = 6;

const reportHeader: HeaderAdmin = {
  title: "Reporte de Ventas por Sucursal",
  subTitle: "Evalua el rendimiento de cada sucursal por periodo y compara resultados.",
};

const emptyReport: ReporteVentasSucursalResponse = {
  items: [],
  resumen: {
    totalVentasPeriodo: 0,
    totalTransacciones: 0,
    ingresoTotal: 0,
    sucursalesAnalizadas: 0,
  },
};

const getTodayInputValue = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const day = `${today.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getMonthStart = (value: string) => `${value.slice(0, 8)}01`;

const formatCurrency = (value: number) =>
  `L ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const SummaryCard = ({
  title,
  value,
  icon,
  accentClassName,
}: {
  title: string;
  value: string;
  icon: typeof faChartLine;
  accentClassName: string;
}) => (
  <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(10,64,89,0.10)]">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-lg text-[#4661b0]">{title}</p>
        <p className={`mt-3 text-4xl font-bold ${accentClassName}`}>{value}</p>
      </div>
      <div className="rounded-2xl bg-[#eef6fb] p-4 text-2xl text-[#4a6eb0]">
        <FontAwesomeIcon icon={icon} />
      </div>
    </div>
  </div>
);

const FilterTag = ({
  isActive,
  label,
  onClick,
}: {
  isActive: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
      isActive
        ? "bg-[#0aa6a2] text-white"
        : "bg-[#edf3fb] text-[#4661b0] hover:bg-[#d9e7f5]"
    }`}
  >
    {label}
  </button>
);

export default function VentasSucursalReport() {
  const today = useMemo(() => getTodayInputValue(), []);
  const [fechaInicio, setFechaInicio] = useState(getMonthStart(today));
  const [fechaFin, setFechaFin] = useState(today);
  const [sucursalIds, setSucursalIds] = useState<string[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);

  const invalidDateRange = Boolean(fechaInicio && fechaFin && fechaInicio > fechaFin);
  const filters = useMemo(
    () => ({
      fechaInicio,
      fechaFin,
      sucursalIds,
    }),
    [fechaInicio, fechaFin, sucursalIds],
  );

  const reportQuery = useVentasSucursalReport(filters, !invalidDateRange);
  const sucursalesQuery = useListSucursales();

  const sucursales = useMemo<Sucursal[]>(
    () => sucursalesQuery.data?.data ?? [],
    [sucursalesQuery.data],
  );

  const report = reportQuery.data ?? emptyReport;

  const totalPaginas = Math.ceil(report.items.length / ITEMS_POR_PAGINA);
  const paginaSegura = totalPaginas === 0 ? 1 : Math.min(paginaActual, totalPaginas);
  const inicio = (paginaSegura - 1) * ITEMS_POR_PAGINA;
  const fin = inicio + ITEMS_POR_PAGINA;
  const itemsPaginados = report.items.slice(inicio, fin);

  const irAPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
    }
  };

  const applyDateRange = (start: string, end: string) => {
    setPaginaActual(1);
    setFechaInicio(start);
    setFechaFin(end);
  };

  const toggleSucursal = (sucursalId: string) => {
    setPaginaActual(1);
    setSucursalIds((current) =>
      current.includes(sucursalId)
        ? current.filter((value) => value !== sucursalId)
        : [...current, sucursalId],
    );
  };

  const clearFilters = () => {
    applyDateRange(getMonthStart(today), today);
    setPaginaActual(1);
    setSucursalIds([]);
  };

  const setQuickRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    const formatInput = (value: Date) => {
      const year = value.getFullYear();
      const month = `${value.getMonth() + 1}`.padStart(2, "0");
      const day = `${value.getDate()}`.padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    applyDateRange(formatInput(start), formatInput(end));
  };

  return (
    <section className="p-6 h-full">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-start gap-4">
          <div className="rounded-[28px] bg-linear-to-br from-[#109c9a] to-[#4a6eb0] p-5 shadow-[0_10px_24px_rgba(10,64,89,0.16)]">
            <FontAwesomeIcon icon={faChartLine} className="text-4xl text-white" />
          </div>
          <HeaderTitleAdmin {...reportHeader} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,2.3fr)_minmax(320px,1fr)]">
          <div className="rounded-[30px] bg-white p-6 shadow-[0_12px_34px_rgba(10,64,89,0.10)]">
            <div className="flex flex-col gap-4 border-b border-[#dbe5ef] pb-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#eef6fb] p-4 text-[#4a6eb0]">
                  <FontAwesomeIcon icon={faFilter} className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0b4d77]">Filtros del reporte</h3>
                  <p className="text-base text-[#4661b0]">
                    Selecciona un periodo y compara una o varias sucursales.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-[#9adce2] px-5 py-3 text-base font-semibold text-[#0aa6a2] hover:bg-[#effafa]"
              >
                <FontAwesomeIcon icon={faArrowRotateLeft} />
                Restablecer filtros
              </button>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-3">
                <span className="text-base font-semibold text-[#0b4d77]">
                  Fecha inicial
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-[#cddaea] px-4 py-4 text-[#4661b0]">
                  <FontAwesomeIcon icon={faCalendarDays} className="text-xl" />
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(event) => {
                      setPaginaActual(1);
                      setFechaInicio(event.target.value);
                    }}
                    className="w-full bg-transparent text-lg outline-none"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-3">
                <span className="text-base font-semibold text-[#0b4d77]">
                  Fecha final
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-[#cddaea] px-4 py-4 text-[#4661b0]">
                  <FontAwesomeIcon icon={faCalendarDays} className="text-xl" />
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(event) => {
                      setPaginaActual(1);
                      setFechaFin(event.target.value);
                    }}
                    className="w-full bg-transparent text-lg outline-none"
                  />
                </div>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <FilterTag
                isActive={fechaInicio === today && fechaFin === today}
                label="Hoy"
                onClick={() => applyDateRange(today, today)}
              />
              <FilterTag
                isActive={false}
                label="Ultimos 7 dias"
                onClick={() => setQuickRange(6)}
              />
              <FilterTag
                isActive={fechaInicio === getMonthStart(today) && fechaFin === today}
                label="Este mes"
                onClick={() => applyDateRange(getMonthStart(today), today)}
              />
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-2xl bg-[#eef6fb] p-3 text-[#4a6eb0]">
                  <FontAwesomeIcon icon={faBuilding} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#0b4d77]">Sucursales</h4>
                  <p className="text-sm text-[#4661b0]">
                    Si no seleccionas ninguna, el sistema compara todas.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPaginaActual(1);
                    setSucursalIds([]);
                  }}
                  className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    sucursalIds.length === 0
                      ? "bg-[#0b4d77] text-white"
                      : "bg-[#edf3fb] text-[#4661b0] hover:bg-[#d9e7f5]"
                  }`}
                >
                  Todas las sucursales
                </button>

                {sucursales.map((sucursal) => {
                  const isSelected = sucursalIds.includes(sucursal.id);

                  return (
                    <button
                      key={sucursal.id}
                      type="button"
                      onClick={() => toggleSucursal(sucursal.id)}
                      className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                        isSelected
                          ? "border-[#0aa6a2] bg-[#effafa] text-[#06706d]"
                          : "border-[#d5e0ea] bg-white text-[#4661b0] hover:border-[#9adce2] hover:bg-[#f5fbff]"
                      }`}
                    >
                      {sucursal.nombre}
                    </button>
                  );
                })}
              </div>

              {sucursalesQuery.isLoading && (
                <p className="mt-4 text-base text-[#4661b0]">Cargando sucursales...</p>
              )}
            </div>

            {invalidDateRange && (
              <div className="mt-6 rounded-2xl border border-[#f5c2c7] bg-[#fff4f4] px-5 py-4 text-[#c20000]">
                La fecha inicial no puede ser mayor que la fecha final.
              </div>
            )}
          </div>

          <div className="rounded-[30px] bg-linear-to-br from-[#0b4d77] via-[#18638b] to-[#11a2a5] p-6 text-white shadow-[0_14px_38px_rgba(10,64,89,0.14)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-white/75">
                  Estado del reporte
                </p>
                <h3 className="mt-3 text-3xl font-bold">Resumen general</h3>
              </div>
              <div className="rounded-2xl bg-white/12 p-4 text-2xl">
                <FontAwesomeIcon icon={faTimeline} />
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-white/75">Periodo consultado</p>
                <p className="mt-2 text-xl font-semibold">
                  {fechaInicio} al {fechaFin}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-white/75">Sucursales seleccionadas</p>
                <p className="mt-2 text-xl font-semibold">
                  {sucursalIds.length === 0 ? "Todas" : sucursalIds.length}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-white/75">Fuente de datos</p>
                <p className="mt-2 text-xl font-semibold">
                  Endpoint de reportes con respaldo automatico del historial de ventas
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total de ventas"
            value={String(report.resumen.totalVentasPeriodo)}
            icon={faShop}
            accentClassName="text-[#0b4d77]"
          />
          <SummaryCard
            title="Total de transacciones"
            value={String(report.resumen.totalTransacciones)}
            icon={faTimeline}
            accentClassName="text-[#0aa6a2]"
          />
          <SummaryCard
            title="Ingreso total"
            value={formatCurrency(report.resumen.ingresoTotal)}
            icon={faCoins}
            accentClassName="text-[#0b4d77]"
          />
          <SummaryCard
            title="Sucursales analizadas"
            value={String(report.resumen.sucursalesAnalizadas)}
            icon={faBuilding}
            accentClassName="text-[#0aa6a2]"
          />
        </div>

        <div className="mt-8 overflow-hidden rounded-[30px] bg-white shadow-[0_12px_34px_rgba(10,64,89,0.10)]">
          <div className="flex flex-col gap-4 border-b border-[#dbe5ef] px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-3xl font-bold text-[#0b4d77]">
                Resultado por sucursal
              </h3>
              <p className="mt-1 text-lg text-[#4661b0]">
                Sucursal, transacciones, total de ventas e ingreso generado.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead>
                <tr className="bg-linear-to-r from-[#109c9a] to-[#4a6eb0] text-left text-white">
                  <th className="px-6 py-4 text-xl font-semibold">Sucursal</th>
                  <th className="px-6 py-4 text-xl font-semibold">Transacciones</th>
                  <th className="px-6 py-4 text-xl font-semibold">Total de ventas</th>
                  <th className="px-6 py-4 text-xl font-semibold">Ingreso generado</th>
                </tr>
              </thead>
              <tbody>
                {invalidDateRange && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-xl text-[#c20000]">
                      Corrige el rango de fechas para generar el reporte.
                    </td>
                  </tr>
                )}

                {!invalidDateRange && reportQuery.isLoading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-xl text-[#4661b0]">
                      Generando reporte de ventas por sucursal...
                    </td>
                  </tr>
                )}

                {!invalidDateRange && !reportQuery.isLoading && reportQuery.isError && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-xl text-[#c20000]">
                      {reportQuery.error instanceof Error
                        ? reportQuery.error.message
                        : "No se pudo cargar el reporte."}
                    </td>
                  </tr>
                )}

                {!invalidDateRange &&
                  !reportQuery.isLoading &&
                  !reportQuery.isError &&
                  report.items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-xl text-[#6a758f]">
                        No hay ventas registradas para los filtros seleccionados.
                      </td>
                    </tr>
                  )}

                {!invalidDateRange &&
                  !reportQuery.isLoading &&
                  !reportQuery.isError &&
                  itemsPaginados.map((item: ReporteVentasSucursalItem) => (
                    <tr
                      key={`${item.sucursalId}-${item.sucursal}`}
                      className="border-b border-[#dbe5ef] text-[#24364d] last:border-b-0"
                    >
                      <td className="px-6 py-5 text-xl font-bold text-[#0b4d77]">
                        {item.sucursal}
                      </td>
                      <td className="px-6 py-5 text-xl text-[#4661b0]">
                        {item.numeroTransacciones}
                      </td>
                      <td className="px-6 py-5 text-xl text-[#4661b0]">
                        {item.totalVentas}
                      </td>
                      <td className="px-6 py-5 text-2xl font-bold text-[#0aa6a2]">
                        {formatCurrency(item.ingresoGenerado)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {report.items.length > 0 && (
          <PaginacionComponent
            paginaActual={paginaSegura}
            totalPaginas={totalPaginas}
            action={irAPagina}
            inicio={inicio}
            fin={fin}
            registros={report.items}
          />
        )}
      </div>
    </section>
  );
}
