import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faBookOpen,
  faCalendarDays,
  faCoins,
  faDownload,
  faFilter,
  faLayerGroup,
  faListOl,
  faScaleBalanced,
  faTimeline,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import PaginacionComponent from "../../../components/Paginacion/PaginacionComponent";
import useCatalogoContableArbol from "../../../hooks/CatalogoCuentasContablesHooks/useCatalogoContableArbol";
import useListPeriodosContables from "../../../hooks/PeriodosContablesHooks/useListPeriodosContables";
import useLibroMayor from "../../../hooks/ReportesHooks/useLibroMayor";
import type {
  ClasificacionContable,
  CuentaContable,
  ElementoContable,
  SubCuentaContable,
} from "../../../interfaces/CatalogoCuentasContables/CatalogoCuentasContables";
import type { HeaderAdmin } from "../../../interfaces/Headers/HeaderInterface";
import type {
  LibroMayorCuenta,
  LibroMayorFilters,
  LibroMayorResponse,
} from "../../../interfaces/Reportes/LibroMayorInterface";
import { exportLibroMayorPdf } from "../../../services/ReportesService";
import {
  formatPeriodoContableLabel,
  getRangeFromPeriodoClave,
} from "../../../utils/periodosContables";

const ITEMS_POR_PAGINA = 3;

const libroMayorHeader: HeaderAdmin = {
  title: "Libro Mayor",
  subTitle: "Analiza los movimientos y saldos acumulados de cada cuenta contable.",
};

const emptyReport: LibroMayorResponse = {
  cuentas: [],
  resumen: {
    totalCuentas: 0,
    totalMovimientos: 0,
    totalDebito: 0,
    totalCredito: 0,
    saldoGlobal: 0,
  },
  periodosDisponibles: [],
};

type CuentaOption = {
  id: string;
  codigo: string;
  nombre: string;
  label: string;
};

type PeriodoFilterOption = {
  id: string;
  label: string;
  fechaInicio: string;
  fechaFin: string;
  periodoClave: string;
};

const formatCurrency = (value: number) =>
  `L ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value: string | null) => {
  if (!value) {
    return "Sin fecha";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-HN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const getTodayInputValue = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const day = `${today.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getMonthStart = (value: string) => `${value.slice(0, 8)}01`;
const formatInputDate = (value: string) => value.slice(0, 10);

const buildFallbackPeriodOption = (periodoClave: string): PeriodoFilterOption | null => {
  const range = getRangeFromPeriodoClave(periodoClave);

  if (!range) {
    return null;
  }

  return {
    id: `fallback:${periodoClave}`,
    label: formatPeriodoContableLabel(periodoClave),
    fechaInicio: range.fechaInicio,
    fechaFin: range.fechaFin,
    periodoClave,
  };
};

const flattenCuentaOptions = (catalogo: ElementoContable[] = []) =>
  catalogo.reduce<CuentaOption[]>((acc, elemento) => {
    (elemento.clasificaciones ?? []).forEach((clasificacion: ClasificacionContable) => {
      (clasificacion.cuentas ?? []).forEach((cuenta: CuentaContable) => {
        (cuenta.subcuentas ?? []).forEach((subcuenta: SubCuentaContable) => {
          if (!subcuenta.disponible) {
            return;
          }

          const codigo = [
            elemento.codigoNumerico,
            clasificacion.codigoNumerico,
            cuenta.codigoNumerico,
            subcuenta.codigoNumerico,
          ].join(".");
          const nombre = `${cuenta.nombre} / ${subcuenta.nombre}`;

          acc.push({
            id: subcuenta.id,
            codigo,
            nombre,
            label: `${codigo} - ${nombre}`,
          });
        });
      });
    });

    return acc;
  }, []).sort((a, b) => a.codigo.localeCompare(b.codigo));

const SummaryCard = ({
  label,
  value,
  icon,
  accentClassName = "text-[#0b4d77]",
}: {
  label: string;
  value: string;
  icon: typeof faBookOpen;
  accentClassName?: string;
}) => (
  <div className="overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(10,64,89,0.10)]">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-lg text-[#4661b0]">{label}</p>
        <p className={`mt-3 text-4xl font-bold ${accentClassName}`}>{value}</p>
      </div>
      <div className="shrink-0 rounded-2xl bg-[#eef6fb] p-4 text-2xl text-[#4a6eb0]">
        <FontAwesomeIcon icon={icon} />
      </div>
    </div>
  </div>
);

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
    className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
      isActive
        ? "bg-[#0aa6a2] text-white shadow-[0_8px_18px_rgba(16,156,154,0.25)]"
        : "bg-[#edf3fb] text-[#4661b0] hover:bg-[#d9e7f5]"
    }`}
  >
    {label}
  </button>
);

const AccountMetric = ({
  label,
  value,
  accentClassName = "text-[#0b3f70]",
}: {
  label: string;
  value: string;
  accentClassName?: string;
}) => (
  <div className="rounded-2xl border border-[#dbe5ef] bg-[#f8fbff] px-4 py-4">
    <p className="text-sm font-semibold uppercase tracking-wide text-[#4661b0]">{label}</p>
    <p className={`mt-2 text-xl font-bold ${accentClassName}`}>{value}</p>
  </div>
);

const AccountGroupCard = ({ cuenta }: { cuenta: LibroMayorCuenta }) => (
  <article className="overflow-hidden rounded-[30px] bg-white p-6 shadow-[0_12px_34px_rgba(10,64,89,0.10)]">
    <div className="flex flex-col gap-5 border-b border-[#dbe5ef] pb-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-[24px] bg-linear-to-br from-[#109c9a] to-[#4a6eb0] p-4 text-2xl text-white shadow-[0_10px_24px_rgba(10,64,89,0.16)]">
          <FontAwesomeIcon icon={faBookOpen} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4661b0]">
            Cuenta contable
          </p>
          <h3 className="mt-2 break-words text-3xl font-bold text-[#0b4d77]">{cuenta.cuentaNombre}</h3>
          <p className="mt-2 text-lg text-[#4661b0]">
            Codigo: <span className="font-bold text-[#0b4d77]">{cuenta.cuentaCodigo}</span>
          </p>
          <p className="mt-1 text-base text-[#6a7ea6]">
            {cuenta.naturaleza ? `Naturaleza: ${cuenta.naturaleza}` : "Naturaleza no disponible"}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AccountMetric label="Saldo inicial" value={formatCurrency(cuenta.saldoInicial)} />
        <AccountMetric label="Debito total" value={formatCurrency(cuenta.totalDebito)} />
        <AccountMetric label="Credito total" value={formatCurrency(cuenta.totalCredito)} />
        <AccountMetric label="Saldo final" value={formatCurrency(cuenta.saldoFinal)} />
      </div>
    </div>

    <div className="mt-6 -mx-6 overflow-x-auto px-6">
      <div className="overflow-hidden rounded-[24px] border border-[#dbe5ef]">
      <table className="w-full min-w-[960px] text-left">
        <thead>
          <tr className="bg-linear-to-r from-[#109c9a] to-[#4a6eb0] text-white">
            <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">Fecha</th>
            <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">Referencia</th>
            <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">Descripcion</th>
            <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">Debito</th>
            <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">Credito</th>
            <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">Saldo acumulado</th>
          </tr>
        </thead>
        <tbody>
          {cuenta.movimientos.map((movimiento) => (
            <tr
              key={`${cuenta.cuentaId}-${movimiento.id}-${movimiento.orden}`}
              className="border-b border-[#edf3fb] bg-white hover:bg-[#f8fbff]"
            >
              <td className="px-5 py-4 text-[#1f3f70]">{formatDate(movimiento.fecha)}</td>
              <td className="px-5 py-4">
                <div className="font-semibold text-[#0b3f70]">
                  {movimiento.numeroAsiento || movimiento.referencia || "Sin referencia"}
                </div>
                {movimiento.numeroAsiento && movimiento.referencia && (
                  <div className="text-sm text-[#6a7ea6]">{movimiento.referencia}</div>
                )}
              </td>
              <td className="px-5 py-4 text-[#1f3f70]">
                {movimiento.descripcion || "Sin descripcion"}
              </td>
              <td className="px-5 py-4 font-semibold text-[#0b3f70]">
                {formatCurrency(movimiento.debito)}
              </td>
              <td className="px-5 py-4 font-semibold text-[#109c9a]">
                {formatCurrency(movimiento.credito)}
              </td>
              <td className="px-5 py-4 text-xl font-bold text-[#0b4d77]">
                {formatCurrency(movimiento.saldoAcumulado)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  </article>
);

export default function LibroMayorReport() {
  const today = useMemo(() => getTodayInputValue(), []);
  const [cuentaId, setCuentaId] = useState("");
  const [selectedPeriodoId, setSelectedPeriodoId] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const periodosQuery = useListPeriodosContables();
  const selectedPeriodo = useMemo(
    () =>
      (periodosQuery.data?.data ?? []).find((periodo) => periodo.id === selectedPeriodoId)
      ?? null,
    [periodosQuery.data?.data, selectedPeriodoId],
  );
  const effectiveFechaInicio = selectedPeriodo ? formatInputDate(selectedPeriodo.fechaInicio) : fechaInicio;
  const effectiveFechaFin = selectedPeriodo ? formatInputDate(selectedPeriodo.fechaFin) : fechaFin;
  const invalidDateRange = Boolean(
    effectiveFechaInicio
    && effectiveFechaFin
    && effectiveFechaInicio > effectiveFechaFin,
  );
  const filters = useMemo<LibroMayorFilters>(() => ({
    ...(cuentaId ? { cuentaId } : {}),
    ...(selectedPeriodo?.periodoClave ? { periodoContable: selectedPeriodo.periodoClave } : {}),
    ...(effectiveFechaInicio ? { fechaInicio: effectiveFechaInicio } : {}),
    ...(effectiveFechaFin ? { fechaFin: effectiveFechaFin } : {}),
  }), [cuentaId, effectiveFechaFin, effectiveFechaInicio, selectedPeriodo?.periodoClave]);

  const reportQuery = useLibroMayor(filters, !invalidDateRange);
  const catalogoQuery = useCatalogoContableArbol();

  const cuentaOptions = useMemo(
    () => flattenCuentaOptions(catalogoQuery.data?.data ?? []),
    [catalogoQuery.data?.data],
  );
  const selectedCuenta = useMemo(
    () => cuentaOptions.find((option) => option.id === cuentaId) ?? null,
    [cuentaId, cuentaOptions],
  );
  const report = reportQuery.data ?? emptyReport;
  const periodOptions = useMemo<PeriodoFilterOption[]>(() => {
    const catalogOptions = (periodosQuery.data?.data ?? []).map((periodo) => ({
      id: periodo.id,
      label: periodo.periodoClave
        ? `${periodo.sucursalNombre} - ${formatPeriodoContableLabel(periodo.periodoClave)}`
        : `${periodo.sucursalNombre} - ${formatInputDate(periodo.fechaInicio)} a ${formatInputDate(periodo.fechaFin)}`,
      fechaInicio: formatInputDate(periodo.fechaInicio),
      fechaFin: formatInputDate(periodo.fechaFin),
      periodoClave: periodo.periodoClave,
    }));
    const fallbackOptions = report.periodosDisponibles
      .map(buildFallbackPeriodOption)
      .filter((value): value is PeriodoFilterOption => Boolean(value))
      .filter((option) =>
        !catalogOptions.some((catalogOption) => catalogOption.periodoClave === option.periodoClave));

    return [...catalogOptions, ...fallbackOptions].sort((a, b) => b.fechaInicio.localeCompare(a.fechaInicio));
  }, [periodosQuery.data?.data, report.periodosDisponibles]);
  const selectedPeriodoOption = useMemo(
    () => periodOptions.find((option) => option.id === selectedPeriodoId) ?? null,
    [periodOptions, selectedPeriodoId],
  );

  const totalPaginas = Math.ceil(report.cuentas.length / ITEMS_POR_PAGINA);
  const paginaSegura = totalPaginas === 0 ? 1 : Math.min(paginaActual, totalPaginas);
  const inicio = (paginaSegura - 1) * ITEMS_POR_PAGINA;
  const fin = inicio + ITEMS_POR_PAGINA;
  const cuentasPaginadas = report.cuentas.slice(inicio, fin);

  const goToPage = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
    }
  };

  const applyDateRange = (start: string, end: string) => {
    setPaginaActual(1);
    setSelectedPeriodoId("");
    setFechaInicio(start);
    setFechaFin(end);
  };

  const resetFilters = () => {
    setPaginaActual(1);
    setCuentaId("");
    setSelectedPeriodoId("");
    setFechaInicio("");
    setFechaFin("");
  };

  const setLastDaysRange = (days: number) => {
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

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const file = await exportLibroMayorPdf(filters);
      const url = window.URL.createObjectURL(file.blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = file.fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Libro mayor exportado correctamente.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo exportar el libro mayor.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="p-6 h-full">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-start gap-4">
          <div className="rounded-[28px] bg-linear-to-br from-[#109c9a] to-[#4a6eb0] p-5 shadow-[0_10px_24px_rgba(10,64,89,0.16)]">
            <FontAwesomeIcon icon={faBookOpen} className="text-4xl text-white" />
          </div>
          <HeaderTitleAdmin {...libroMayorHeader} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,2.2fr)_minmax(320px,1fr)]">
          <div className="overflow-hidden rounded-[30px] bg-white p-6 shadow-[0_12px_34px_rgba(10,64,89,0.10)]">
            <div className="flex flex-col gap-4 border-b border-[#dbe5ef] pb-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="shrink-0 rounded-2xl bg-[#eef6fb] p-4 text-[#4a6eb0]">
                  <FontAwesomeIcon icon={faFilter} className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0b4d77]">Filtros del libro mayor</h3>
                  <p className="text-base text-[#4661b0]">
                    Consulta una cuenta especifica o todas las cuentas dentro del periodo deseado.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-[#9adce2] px-5 py-3 text-base font-semibold text-[#0aa6a2] hover:bg-[#effafa]"
                >
                  <FontAwesomeIcon icon={faArrowRotateLeft} />
                  Restablecer
                </button>
                <button
                  type="button"
                  onClick={() => void handleExport()}
                  disabled={isExporting || reportQuery.isLoading || invalidDateRange}
                  className="inline-flex cursor-pointer items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#109c9a] to-[#4a6eb0] px-5 py-3 text-base font-semibold text-white shadow-[0_10px_24px_rgba(10,64,89,0.12)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FontAwesomeIcon icon={faDownload} />
                  {isExporting ? "Exportando..." : "Exportar PDF"}
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <label className="flex flex-col gap-3 xl:col-span-2">
                <span className="text-base font-semibold text-[#0b4d77]">Cuenta contable</span>
                <select
                  value={cuentaId}
                  onChange={(event) => {
                    setPaginaActual(1);
                    setCuentaId(event.target.value);
                  }}
                  className="rounded-2xl border border-[#cddaea] bg-white px-4 py-4 text-lg text-[#1f3f70] outline-none"
                >
                  <option value="">Todas las cuentas contables</option>
                  {cuentaOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-3 xl:col-span-2">
                <span className="text-base font-semibold text-[#0b4d77]">Periodo contable</span>
                <select
                  value={selectedPeriodoId}
                  onChange={(event) => {
                    setPaginaActual(1);
                    setSelectedPeriodoId(event.target.value);
                  }}
                  className="rounded-2xl border border-[#cddaea] bg-white px-4 py-4 text-lg text-[#1f3f70] outline-none"
                >
                  <option value="">Todos los periodos</option>
                  {periodOptions.map((periodo) => (
                    <option key={periodo.id} value={periodo.id}>
                      {periodo.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-3">
                <span className="text-base font-semibold text-[#0b4d77]">Fecha inicial</span>
                <div className="flex items-center gap-3 rounded-2xl border border-[#cddaea] px-4 py-4 text-[#4661b0]">
                  <FontAwesomeIcon icon={faCalendarDays} className="text-xl" />
                  <input
                    type="date"
                    value={effectiveFechaInicio}
                    onChange={(event) => {
                      setPaginaActual(1);
                      setSelectedPeriodoId("");
                      setFechaInicio(event.target.value);
                    }}
                    className="w-full bg-transparent text-lg outline-none"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-3">
                <span className="text-base font-semibold text-[#0b4d77]">Fecha final</span>
                <div className="flex items-center gap-3 rounded-2xl border border-[#cddaea] px-4 py-4 text-[#4661b0]">
                  <FontAwesomeIcon icon={faCalendarDays} className="text-xl" />
                  <input
                    type="date"
                    value={effectiveFechaFin}
                    onChange={(event) => {
                      setPaginaActual(1);
                      setSelectedPeriodoId("");
                      setFechaFin(event.target.value);
                    }}
                    className="w-full bg-transparent text-lg outline-none"
                  />
                </div>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <FilterTag
                label="Hoy"
                isActive={!selectedPeriodoId && fechaInicio === today && fechaFin === today}
                onClick={() => applyDateRange(today, today)}
              />
              <FilterTag
                label="Este mes"
                isActive={!selectedPeriodoId && fechaInicio === getMonthStart(today) && fechaFin === today}
                onClick={() => applyDateRange(getMonthStart(today), today)}
              />
              <FilterTag
                label="Ultimos 30 dias"
                isActive={false}
                onClick={() => setLastDaysRange(29)}
              />
              <FilterTag
                label="Sin rango"
                isActive={!selectedPeriodoId && !fechaInicio && !fechaFin}
                onClick={() => applyDateRange("", "")}
              />
            </div>

            {invalidDateRange && (
              <div className="mt-5 rounded-2xl border border-[#f2c1c1] bg-[#fff5f5] px-5 py-4 text-base text-[#b54747]">
                La fecha inicial no puede ser mayor que la fecha final.
              </div>
            )}

            {catalogoQuery.isLoading && (
              <p className="mt-5 text-base text-[#4661b0]">Cargando catalogo de cuentas contables...</p>
            )}
            {periodosQuery.isLoading && (
              <p className="mt-3 text-base text-[#4661b0]">Cargando catalogo de periodos contables...</p>
            )}
            {periodosQuery.isError && (
              <p className="mt-3 text-base text-[#b54747]">
                {periodosQuery.error?.message || "No se pudieron cargar los periodos contables."}
              </p>
            )}
          </div>

          <div className="overflow-hidden rounded-[30px] bg-linear-to-br from-[#0b4d77] via-[#18638b] to-[#11a2a5] p-6 text-white shadow-[0_14px_38px_rgba(10,64,89,0.14)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-white/75">Estado del reporte</p>
                <h3 className="mt-3 text-3xl font-bold">Resumen general</h3>
              </div>
              <div className="shrink-0 rounded-2xl bg-white/12 p-4 text-2xl">
                <FontAwesomeIcon icon={faTimeline} />
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-white/75">Cuenta seleccionada</p>
                <p className="mt-2 break-words text-xl font-semibold">
                  {selectedCuenta?.label || "Todas las cuentas"}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-white/75">Periodo contable</p>
                <p className="mt-2 text-xl font-semibold">
                  {selectedPeriodoOption?.label || "Todos"}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-white/75">Rango consultado</p>
                <p className="mt-2 text-xl font-semibold">
                  {effectiveFechaInicio || "Inicio abierto"} a {effectiveFechaFin || "Fin abierto"}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-white/75">Fuente</p>
                <p className="mt-2 text-xl font-semibold">
                  Endpoints de reportes con respaldo automatico desde libro diario
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            label="Cuentas analizadas"
            value={String(report.resumen.totalCuentas)}
            icon={faLayerGroup}
          />
          <SummaryCard
            label="Movimientos"
            value={String(report.resumen.totalMovimientos)}
            icon={faListOl}
            accentClassName="text-[#109c9a]"
          />
          <SummaryCard
            label="Debito total"
            value={formatCurrency(report.resumen.totalDebito)}
            icon={faScaleBalanced}
          />
          <SummaryCard
            label="Credito total"
            value={formatCurrency(report.resumen.totalCredito)}
            icon={faCoins}
            accentClassName="text-[#109c9a]"
          />
          <SummaryCard
            label="Saldo global"
            value={formatCurrency(report.resumen.saldoGlobal)}
            icon={faTimeline}
          />
        </div>

        <div className="mt-8 rounded-[32px] border border-[#dce7f1] bg-white p-6 shadow-[0_12px_34px_rgba(10,64,89,0.10)]">
          <div className="mb-6 flex flex-col gap-4 border-b border-[#dbe5ef] pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#eef6fb] p-4 text-[#4a6eb0]">
                <FontAwesomeIcon icon={faTimeline} className="text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#0b4d77]">Movimientos agrupados por cuenta</h3>
                <p className="text-base text-[#4661b0]">
                  Fecha, descripcion, debito, credito y saldo acumulado por cada cuenta contable.
                </p>
              </div>
            </div>
            <div className="rounded-full bg-[#f4f8fc] px-4 py-2 text-sm font-semibold text-[#4661b0]">
              Pagina {paginaSegura} de {Math.max(totalPaginas, 1)}
            </div>
          </div>

          {invalidDateRange ? (
            <div className="rounded-2xl bg-[#fff5f5] px-6 py-10 text-lg font-semibold text-[#b54747]">
              Corrige el rango de fechas para generar el reporte.
            </div>
          ) : reportQuery.isLoading ? (
            <div className="rounded-2xl bg-[#f8fbff] px-6 py-10 text-lg font-semibold text-[#4661b0]">
              Cargando libro mayor...
            </div>
          ) : reportQuery.isError ? (
            <div className="rounded-2xl bg-[#fff5f5] px-6 py-10 text-lg font-semibold text-[#b54747]">
              {reportQuery.error?.message || "No se pudo cargar el libro mayor."}
            </div>
          ) : report.cuentas.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-[#c9d9ea] bg-[#f8fbff] px-6 py-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef6fb] text-2xl text-[#4a6eb0]">
                <FontAwesomeIcon icon={faBookOpen} />
              </div>
              <h4 className="mt-5 text-2xl font-bold text-[#0b4d77]">
                No hay movimientos para mostrar
              </h4>
              <p className="mx-auto mt-3 max-w-2xl text-lg leading-8 text-[#4661b0]">
                Cambia la cuenta, el periodo o el rango de fechas para consultar otro conjunto de movimientos contables.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {cuentasPaginadas.map((cuenta) => (
                <AccountGroupCard key={cuenta.cuentaId || cuenta.cuentaCodigo} cuenta={cuenta} />
              ))}
            </div>
          )}
        </div>

        {report.cuentas.length > 0 && (
          <PaginacionComponent
            paginaActual={paginaSegura}
            totalPaginas={totalPaginas}
            action={goToPage}
            inicio={inicio}
            fin={fin}
            registros={report.cuentas}
          />
        )}
      </div>
    </section>
  );
}
