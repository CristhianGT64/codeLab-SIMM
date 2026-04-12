import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faBoxesStacked,
  faCalendarDays,
  faDownload,
  faFilter,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import PaginacionComponent from "../../../components/Paginacion/PaginacionComponent";
import useListProduct from "../../../hooks/ProductosHooks/useListProduct";
import useAjustesInventarioReport from "../../../hooks/ReportesHooks/useAjustesInventarioReport";
import type { HeaderAdmin } from "../../../interfaces/Headers/HeaderInterface";
import type {
  AjusteInventarioReportFilters,
  AjusteInventarioReportItem,
  AjusteInventarioReportResponse,
  TipoAjusteInventario,
} from "../../../interfaces/Reportes/AjustesInventarioReportInterface";
import { exportAjustesInventarioPdf } from "../../../services/ReportesService";

const ITEMS_POR_PAGINA = 8;

const reportHeader: HeaderAdmin = {
  title: "Reporte de Ajustes de Inventario",
  subTitle: "Identifica perdidas, deterioros y sobrantes con su impacto economico.",
};

const emptyReport: AjusteInventarioReportResponse = {
  items: [],
  resumen: {
    totalRegistros: 0,
    totalCantidadAjustada: 0,
    impactoTotal: 0,
    impactoNegativoTotal: 0,
    impactoPositivoTotal: 0,
    porTipo: {
      PERDIDA: { cantidadAjustes: 0, impactoEconomico: 0 },
      DETERIORO: { cantidadAjustes: 0, impactoEconomico: 0 },
      SOBRANTE: { cantidadAjustes: 0, impactoEconomico: 0 },
    },
  },
  filtrosAplicados: {
    productoId: null,
    fechaInicio: null,
    fechaFin: null,
    tipoAjuste: null,
  },
};

const tipoAjusteButtons: Array<{ value: TipoAjusteInventario; label: string }> = [
  { value: "PERDIDA", label: "Perdida" },
  { value: "DETERIORO", label: "Deterioro" },
  { value: "SOBRANTE", label: "Sobrante" },
];

const parseDateValue = (value: string) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(value);
};

const formatInputDate = (value: Date) => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getTodayInputValue = () => formatInputDate(new Date());

const getMonthStart = (value: string) => `${value.slice(0, 8)}01`;

const getRelativeRange = (days: number) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);

  return {
    start: formatInputDate(start),
    end: formatInputDate(end),
  };
};

const formatNumber = (value: number) => Number(value || 0).toLocaleString("en-US");

const formatCurrency = (value: number) =>
  `L ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value: string | null, includeTime = false) => {
  if (!value) return "Sin fecha";
  const parsed = parseDateValue(value);
  if (Number.isNaN(parsed.getTime())) return "Sin fecha";

  return new Intl.DateTimeFormat(
    "es-HN",
    includeTime
      ? {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      : { day: "2-digit", month: "short", year: "numeric" },
  ).format(parsed);
};

const FilterTag = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "border-[#0b4d77] bg-[#0b4d77] text-white"
        : "border-[#d7e2ec] bg-white text-[#4661b0] hover:bg-[#f6f9fc]"
    }`}
  >
    {label}
  </button>
);

const TypeBadge = ({ tipo, label }: { tipo: TipoAjusteInventario; label: string }) => {
  const className =
    tipo === "PERDIDA"
      ? "bg-[#fff1ea] text-[#a9552c]"
      : tipo === "DETERIORO"
        ? "bg-[#fff6e6] text-[#9a7213]"
        : "bg-[#ebfbf7] text-[#06706d]";

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{label}</span>;
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="border-b border-[#e7edf4] py-3 last:border-b-0">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b7f97]">{label}</p>
    <p className="mt-2 text-sm leading-6 text-[#24364d]">{value}</p>
  </div>
);

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
};

export default function AjustesInventarioReport() {
  const today = useMemo(() => getTodayInputValue(), []);
  const defaultMonthStart = useMemo(() => getMonthStart(today), [today]);
  const lastSevenDaysRange = useMemo(() => getRelativeRange(6), []);
  const [productoId, setProductoId] = useState("");
  const [fechaInicio, setFechaInicio] = useState(defaultMonthStart);
  const [fechaFin, setFechaFin] = useState(today);
  const [tipoAjuste, setTipoAjuste] = useState<TipoAjusteInventario | "">("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [selectedAjusteId, setSelectedAjusteId] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const invalidDateRange = Boolean(fechaInicio && fechaFin && fechaInicio > fechaFin);

  const filters = useMemo<AjusteInventarioReportFilters>(
    () => ({ productoId: productoId || undefined, fechaInicio, fechaFin, tipoAjuste }),
    [productoId, fechaInicio, fechaFin, tipoAjuste],
  );

  const reportQuery = useAjustesInventarioReport(filters, !invalidDateRange);
  const productsQuery = useListProduct();
  const products = useMemo(() => productsQuery.data?.data ?? [], [productsQuery.data]);
  const report = reportQuery.data ?? emptyReport;
  const reportErrorMessage =
    reportQuery.error instanceof Error ? reportQuery.error.message : "No se pudo cargar el reporte.";

  const totalPaginas = Math.ceil(report.items.length / ITEMS_POR_PAGINA);
  const paginaSegura = totalPaginas === 0 ? 1 : Math.min(paginaActual, totalPaginas);
  const inicio = (paginaSegura - 1) * ITEMS_POR_PAGINA;
  const fin = inicio + ITEMS_POR_PAGINA;
  const itemsPaginados = report.items.slice(inicio, fin);

  const selectedItem = useMemo<AjusteInventarioReportItem | null>(
    () => report.items.find((item) => item.id === selectedAjusteId) ?? report.items[0] ?? null,
    [report.items, selectedAjusteId],
  );

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productoId) ?? null,
    [products, productoId],
  );

  const isTodayRange = fechaInicio === today && fechaFin === today;
  const isLastSevenDaysRange =
    fechaInicio === lastSevenDaysRange.start && fechaFin === lastSevenDaysRange.end;
  const isCurrentMonthRange = fechaInicio === defaultMonthStart && fechaFin === today;

  const applyDateRange = (start: string, end: string) => {
    setPaginaActual(1);
    setSelectedAjusteId("");
    setFechaInicio(start);
    setFechaFin(end);
  };

  const setQuickRange = (days: number) => {
    const range = getRelativeRange(days);
    applyDateRange(range.start, range.end);
  };

  const clearFilters = () => {
    setPaginaActual(1);
    setProductoId("");
    setTipoAjuste("");
    setSelectedAjusteId("");
    applyDateRange(defaultMonthStart, today);
  };

  const handleExport = async () => {
    if (invalidDateRange) {
      toast.error("Corrige el rango de fechas para exportar el reporte.");
      return;
    }

    try {
      setIsExporting(true);
      const result = await exportAjustesInventarioPdf(filters);
      downloadBlob(result.blob, result.fileName);
      toast.success("Reporte de ajustes exportado correctamente.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo exportar el reporte.");
    } finally {
      setIsExporting(false);
    }
  };

  const irAPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
      setSelectedAjusteId(report.items[(pagina - 1) * ITEMS_POR_PAGINA]?.id ?? "");
    }
  };

  return (
    <section className="h-full bg-[#f6f9fc] p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-start gap-4">
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <FontAwesomeIcon icon={faBoxesStacked} className="text-3xl text-[#0b4d77]" />
          </div>
          <HeaderTitleAdmin {...reportHeader} />
        </div>

        <div className="mb-6 rounded-3xl border border-[#dbe5ef] bg-white p-6">
          <div className="flex flex-col gap-4 border-b border-[#e7edf4] pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#f3f7fb] p-3 text-[#4a6eb0]">
                <FontAwesomeIcon icon={faFilter} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0b4d77]">Filtros</h3>
                <p className="text-sm text-[#6b7f97]">Producto, fechas y tipo de ajuste.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#d7e2ec] px-4 py-2 text-sm font-medium text-[#4661b0] hover:bg-[#f6f9fc]"
              >
                <FontAwesomeIcon icon={faArrowRotateLeft} />
                Restablecer
              </button>
              <button
                type="button"
                onClick={() => void handleExport()}
                disabled={isExporting || reportQuery.isLoading || invalidDateRange}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0b4d77] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FontAwesomeIcon icon={faDownload} />
                {isExporting ? "Exportando..." : "Exportar PDF"}
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[#24364d]">Producto</span>
              <select
                value={productoId}
                onChange={(event) => {
                  setPaginaActual(1);
                  setSelectedAjusteId("");
                  setProductoId(event.target.value);
                }}
                className="rounded-xl border border-[#d7e2ec] bg-white px-4 py-3 text-sm text-[#24364d] outline-none focus:border-[#0b4d77]"
              >
                <option value="">Todos los productos</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[#24364d]">Fecha inicial</span>
              <div className="flex items-center gap-3 rounded-xl border border-[#d7e2ec] px-4 py-3 text-[#4661b0]">
                <FontAwesomeIcon icon={faCalendarDays} />
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(event) => {
                    setPaginaActual(1);
                    setSelectedAjusteId("");
                    setFechaInicio(event.target.value);
                  }}
                  className="w-full bg-transparent text-sm text-[#24364d] outline-none"
                />
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[#24364d]">Fecha final</span>
              <div className="flex items-center gap-3 rounded-xl border border-[#d7e2ec] px-4 py-3 text-[#4661b0]">
                <FontAwesomeIcon icon={faCalendarDays} />
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(event) => {
                    setPaginaActual(1);
                    setSelectedAjusteId("");
                    setFechaFin(event.target.value);
                  }}
                  className="w-full bg-transparent text-sm text-[#24364d] outline-none"
                />
              </div>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <FilterTag
              label="Todos"
              isActive={tipoAjuste === ""}
              onClick={() => {
                setPaginaActual(1);
                setSelectedAjusteId("");
                setTipoAjuste("");
              }}
            />
            {tipoAjusteButtons.map((option) => (
              <FilterTag
                key={option.value}
                label={option.label}
                isActive={tipoAjuste === option.value}
                onClick={() => {
                  setPaginaActual(1);
                  setSelectedAjusteId("");
                  setTipoAjuste(option.value);
                }}
              />
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <FilterTag label="Hoy" isActive={isTodayRange} onClick={() => applyDateRange(today, today)} />
            <FilterTag
              label="Ultimos 7 dias"
              isActive={isLastSevenDaysRange}
              onClick={() => setQuickRange(6)}
            />
            <FilterTag
              label="Este mes"
              isActive={isCurrentMonthRange}
              onClick={() => applyDateRange(defaultMonthStart, today)}
            />
          </div>

          {invalidDateRange && (
            <div className="mt-4 rounded-xl border border-[#f4c98f] bg-[#fff8ec] px-4 py-3 text-sm text-[#9a5b12]">
              <FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />
              La fecha inicial no puede ser mayor que la fecha final.
            </div>
          )}
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#dbe5ef] bg-white p-5">
            <p className="text-sm text-[#6b7f97]">Ajustes encontrados</p>
            <p className="mt-2 text-3xl font-bold text-[#0b4d77]">{formatNumber(report.resumen.totalRegistros)}</p>
          </div>
          <div className="rounded-2xl border border-[#dbe5ef] bg-white p-5">
            <p className="text-sm text-[#6b7f97]">Cantidad ajustada</p>
            <p className="mt-2 text-3xl font-bold text-[#0b4d77]">{formatNumber(report.resumen.totalCantidadAjustada)}</p>
          </div>
          <div className="rounded-2xl border border-[#dbe5ef] bg-white p-5">
            <p className="text-sm text-[#6b7f97]">Impacto neto</p>
            <p className={`mt-2 text-3xl font-bold ${report.resumen.impactoTotal >= 0 ? "text-[#109c9a]" : "text-[#a9552c]"}`}>
              {formatCurrency(report.resumen.impactoTotal)}
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_340px]">
          <div className="rounded-3xl border border-[#dbe5ef] bg-white p-6">
            <div className="mb-5 flex flex-col gap-2 border-b border-[#e7edf4] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#0b4d77]">Resultados</h3>
                <p className="text-sm text-[#6b7f97]">
                  {selectedProduct ? selectedProduct.nombre : "Todos los productos"} · {tipoAjuste || "Todos los ajustes"}
                </p>
              </div>
              <p className="text-sm text-[#6b7f97]">{formatDate(fechaInicio)} al {formatDate(fechaFin)}</p>
            </div>

            {reportQuery.isLoading && (
              <div className="rounded-xl bg-[#f6f9fc] px-4 py-6 text-sm text-[#4661b0]">Cargando ajustes de inventario...</div>
            )}

            {reportQuery.isError && (
              <div className="rounded-xl bg-[#fff6f6] px-4 py-6 text-sm text-[#b64a55]">{reportErrorMessage}</div>
            )}

            {!reportQuery.isLoading && !reportQuery.isError && report.items.length === 0 && (
              <div className="rounded-xl border border-dashed border-[#c9d7e6] bg-[#f9fbfd] px-6 py-10 text-center">
                <p className="text-base font-semibold text-[#0b4d77]">No hay ajustes para los filtros seleccionados.</p>
                <p className="mt-2 text-sm text-[#6b7f97]">Prueba otro producto, rango de fechas o tipo de ajuste.</p>
              </div>
            )}

            {!reportQuery.isLoading && !reportQuery.isError && report.items.length > 0 && (
              <>
                <div className="overflow-x-auto rounded-2xl border border-[#e7edf4]">
                  <table className="w-full min-w-[920px] text-left">
                    <thead>
                      <tr className="bg-[#f6f9fc] text-[#4661b0]">
                        <th className="px-4 py-3 text-sm font-semibold">Producto</th>
                        <th className="px-4 py-3 text-sm font-semibold">Sucursal</th>
                        <th className="px-4 py-3 text-sm font-semibold">Tipo</th>
                        <th className="px-4 py-3 text-sm font-semibold">Fecha</th>
                        <th className="px-4 py-3 text-sm font-semibold">Cantidad</th>
                        <th className="px-4 py-3 text-sm font-semibold">Impacto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsPaginados.map((item) => {
                        const isSelected = selectedItem?.id === item.id;

                        return (
                          <tr
                            key={item.id}
                            onClick={() => setSelectedAjusteId(item.id)}
                            className={`cursor-pointer border-t border-[#e7edf4] ${isSelected ? "bg-[#f3f8fc]" : "bg-white hover:bg-[#fafcfe]"}`}
                          >
                            <td className="px-4 py-4 align-top">
                              <p className="font-semibold text-[#24364d]">{item.producto.nombre}</p>
                              <p className="mt-1 text-xs text-[#6b7f97]">SKU: {item.producto.sku}</p>
                            </td>
                            <td className="px-4 py-4 text-sm text-[#4661b0]">{item.sucursal.nombre}</td>
                            <td className="px-4 py-4">
                              <TypeBadge tipo={item.tipoAjuste} label={item.tipoAjusteLabel} />
                            </td>
                            <td className="px-4 py-4 text-sm text-[#4661b0]">{formatDate(item.fechaAjuste)}</td>
                            <td className="px-4 py-4 text-sm font-semibold text-[#24364d]">{formatNumber(item.cantidadAjustada)}</td>
                            <td className={`px-4 py-4 text-sm font-semibold ${item.impactoEconomico >= 0 ? "text-[#109c9a]" : "text-[#a9552c]"}`}>
                              {formatCurrency(item.impactoEconomico)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {totalPaginas > 0 && (
                  <PaginacionComponent
                    inicio={inicio}
                    fin={fin}
                    registros={report.items}
                    paginaActual={paginaSegura}
                    totalPaginas={totalPaginas}
                    action={irAPagina}
                  />
                )}
              </>
            )}
          </div>

          <aside className="rounded-3xl border border-[#dbe5ef] bg-white p-6">
            <div className="border-b border-[#e7edf4] pb-4">
              <h3 className="text-xl font-bold text-[#0b4d77]">Detalle del ajuste</h3>
              <p className="mt-1 text-sm text-[#6b7f97]">Selecciona un registro de la tabla para ver mas informacion.</p>
            </div>

            {selectedItem ? (
              <div className="mt-5">
                <div className="rounded-2xl bg-[#f6f9fc] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-[#24364d]">{selectedItem.producto.nombre}</p>
                      <p className="mt-1 text-sm text-[#6b7f97]">
                        {selectedItem.sucursal.nombre} · {formatDate(selectedItem.fechaAjuste, true)}
                      </p>
                    </div>
                    <TypeBadge tipo={selectedItem.tipoAjuste} label={selectedItem.tipoAjusteLabel} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b7f97]">Cantidad</p>
                      <p className="mt-2 text-2xl font-bold text-[#0b4d77]">{formatNumber(selectedItem.cantidadAjustada)}</p>
                    </div>
                    <div className="rounded-xl bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b7f97]">Impacto</p>
                      <p className={`mt-2 text-2xl font-bold ${selectedItem.impactoEconomico >= 0 ? "text-[#109c9a]" : "text-[#a9552c]"}`}>
                        {formatCurrency(selectedItem.impactoEconomico)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <DetailRow label="Stock resultante" value={formatNumber(selectedItem.stockResultante)} />
                  <DetailRow label="Costo unitario" value={formatCurrency(selectedItem.costoUnitario)} />
                  <DetailRow label="Movimiento" value={selectedItem.tipoMovimiento === "entrada" ? "Entrada" : "Salida"} />
                  <DetailRow
                    label="Usuario"
                    value={selectedItem.usuario ? `${selectedItem.usuario.nombreCompleto} (${selectedItem.usuario.usuario})` : "No disponible"}
                  />
                  <DetailRow label="Referencia" value={selectedItem.referenciaTipo || "Movimiento manual"} />
                  <DetailRow label="Motivo" value={selectedItem.detalleMotivo || "Sin detalle adicional"} />
                  <DetailRow label="Observaciones" value={selectedItem.observaciones || "Sin observaciones"} />
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-[#c9d7e6] bg-[#f9fbfd] px-4 py-8 text-center text-sm text-[#6b7f97]">
                No hay un ajuste seleccionado.
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}


