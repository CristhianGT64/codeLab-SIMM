import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRotateLeft,
  faBookOpen,
  faCalendarDays,
  faCircleCheck,
  faDownload,
  faEye,
  faFilter,
  faScaleBalanced,
  faTimeline,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import PaginacionComponent from "../../../components/Paginacion/PaginacionComponent";
import useCatalogoContableArbol from "../../../hooks/CatalogoCuentasContablesHooks/useCatalogoContableArbol";
import useListPeriodosContables from "../../../hooks/PeriodosContablesHooks/useListPeriodosContables";
import useLibroDiario from "../../../hooks/ReportesHooks/useLibroDiario";
import useLibroDiarioDetail from "../../../hooks/ReportesHooks/useLibroDiarioDetail";
import type {
  ClasificacionContable,
  CuentaContable,
  ElementoContable,
  SubCuentaContable,
} from "../../../interfaces/CatalogoCuentasContables/CatalogoCuentasContables";
import type { HeaderAdmin } from "../../../interfaces/Headers/HeaderInterface";
import type {
  LibroDiarioAsiento,
  LibroDiarioDetalle,
  LibroDiarioFilters,
  LibroDiarioMovimiento,
} from "../../../interfaces/Reportes/LibroDiarioInterface";
import { exportLibroDiarioPdf } from "../../../services/ReportesService";
import { formatPeriodoContableLabel } from "../../../utils/periodosContables";

const ITEMS_POR_PAGINA = 8;

const libroDiarioHeader: HeaderAdmin = {
  title: "Libro Diario",
  subTitle: "Consulta asientos contables cronologicamente, revisa el detalle y exporta el reporte.",
};

const formatCurrency = (value: number) =>
  `L ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value: string | null, includeTime = false) => {
  if (!value) return "Sin fecha";

  return new Intl.DateTimeFormat("es-HN", includeTime
    ? { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }
    : { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
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

const humanizeTipoOperacion = (value: string) => {
  switch (value) {
    case "VENTA": return "Venta";
    case "VENTA_COSTO": return "Costo de venta";
    case "INVENTARIO_ENTRADA": return "Entrada de inventario";
    case "INVENTARIO_DANIO": return "Salida por danio";
    case "INVENTARIO_CONSUMO_INTERNO": return "Consumo interno";
    case "INVENTARIO_AJUSTE": return "Ajuste de inventario";
    case "INVENTARIO_OTRO": return "Otro movimiento";
    default: return value || "Operacion no definida";
  }
};

const SummaryCard = ({
  label,
  value,
  accentClassName = "text-[#0b4d77]",
}: {
  label: string;
  value: string;
  accentClassName?: string;
}) => (
  <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(10,64,89,0.10)]">
    <p className="text-lg text-[#4661b0]">{label}</p>
    <p className={`mt-3 text-4xl font-bold ${accentClassName}`}>{value}</p>
  </div>
);

const DetailMetric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-[#dbe5ef] bg-[#f8fbff] px-4 py-4">
    <p className="text-sm font-semibold uppercase tracking-wide text-[#4661b0]">{label}</p>
    <p className="mt-2 text-xl font-bold text-[#0b3f70]">{value}</p>
  </div>
);

const BalanceBadge = ({ balanceado }: { balanceado: boolean }) => (
  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
    balanceado ? "bg-[#e8f8f2] text-[#127a52]" : "bg-[#fff4df] text-[#b7791f]"
  }`}>
    <FontAwesomeIcon icon={balanceado ? faCircleCheck : faTriangleExclamation} />
    {balanceado ? "Balanceado" : "Pendiente"}
  </span>
);

type CuentaLookup = Record<string, { nombre: string; codigo: string }>;
type LibroDiarioRow = {
  key: string;
  asientoId: string;
  fecha: string | null;
  numeroAsiento: string;
  descripcion: string | null;
  cuentaContableNombre: string;
  cuentaContableCodigo: string;
  montoDebe: number;
  montoHaber: number;
  tipoOperacion: string;
};

type PeriodoFilterOption = {
  id: string;
  label: string;
  fechaInicio: string;
  fechaFin: string;
  periodoClave: string;
  estado: string;
};

const flattenCuentaLookup = (catalogo: ElementoContable[] = []) =>
  catalogo.reduce<CuentaLookup>((acc, elemento) => {
    (elemento.clasificaciones ?? []).forEach((clasificacion: ClasificacionContable) => {
      (clasificacion.cuentas ?? []).forEach((cuenta: CuentaContable) => {
        (cuenta.subcuentas ?? []).forEach((subcuenta: SubCuentaContable) => {
          acc[subcuenta.id] = {
            nombre: `${cuenta.nombre} / ${subcuenta.nombre}`,
            codigo: [
              elemento.codigoNumerico,
              clasificacion.codigoNumerico,
              cuenta.codigoNumerico,
              subcuenta.codigoNumerico,
            ].join("."),
          };
        });
      });
    });

    return acc;
  }, {});

const hydrateMovimiento = (movimiento: LibroDiarioMovimiento, cuentaLookup: CuentaLookup) => {
  const cuenta = cuentaLookup[movimiento.subCuentaContableId];

  return {
    ...movimiento,
    cuentaContableNombre:
      movimiento.cuentaContableNombre || cuenta?.nombre || "Cuenta contable no disponible",
    cuentaContableCodigo:
      movimiento.cuentaContableCodigo || cuenta?.codigo || movimiento.subCuentaContableId,
  };
};

const hydrateAsiento = (asiento: LibroDiarioAsiento | LibroDiarioDetalle, cuentaLookup: CuentaLookup) => ({
  ...asiento,
  detalles: asiento.detalles.map((detalle) => hydrateMovimiento(detalle, cuentaLookup)),
});

const LibroDiarioDetailView = ({
  asiento,
  isLoading,
  isError,
  error,
  onBack,
}: {
  asiento: LibroDiarioDetalle | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onBack: () => void;
}) => {
  if (isLoading) {
    return (
      <section className="p-6 h-full"><div className="mx-auto max-w-7xl">
        <button type="button" onClick={onBack} className="mb-5 inline-flex cursor-pointer items-center gap-2 text-lg font-semibold text-[#0aa6a2] hover:text-[#06706d]">
          <FontAwesomeIcon icon={faArrowLeft} /> Volver al libro diario
        </button>
        <div className="rounded-[30px] bg-white p-10 shadow-[0_14px_40px_rgba(10,64,89,0.12)]">
          <p className="text-xl font-semibold text-[#4661b0]">Cargando detalle del asiento contable...</p>
        </div>
      </div></section>
    );
  }

  if (isError || !asiento) {
    return (
      <section className="p-6 h-full"><div className="mx-auto max-w-7xl">
        <button type="button" onClick={onBack} className="mb-5 inline-flex cursor-pointer items-center gap-2 text-lg font-semibold text-[#0aa6a2] hover:text-[#06706d]">
          <FontAwesomeIcon icon={faArrowLeft} /> Volver al libro diario
        </button>
        <div className="rounded-[30px] bg-white p-10 shadow-[0_14px_40px_rgba(10,64,89,0.12)]">
          <h3 className="text-2xl font-bold text-[#0b4d77]">No pudimos cargar el detalle</h3>
          <p className="mt-3 text-lg text-[#4661b0]">{error instanceof Error ? error.message : "No se encontro informacion para el asiento solicitado."}</p>
        </div>
      </div></section>
    );
  }

  return (
    <section className="p-6 h-full">
      <div className="mx-auto max-w-7xl">
        <button type="button" onClick={onBack} className="mb-5 inline-flex cursor-pointer items-center gap-2 text-lg font-semibold text-[#0aa6a2] hover:text-[#06706d]">
          <FontAwesomeIcon icon={faArrowLeft} /> Volver al libro diario
        </button>

        <div className="mb-8 flex flex-col gap-4 rounded-[30px] bg-white p-6 shadow-[0_14px_40px_rgba(10,64,89,0.12)] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-[28px] bg-linear-to-br from-[#109c9a] to-[#4a6eb0] p-5 shadow-[0_10px_24px_rgba(10,64,89,0.16)]">
              <FontAwesomeIcon icon={faBookOpen} className="text-4xl text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4661b0]">Asiento contable</p>
              <h2 className="mt-2 text-3xl font-bold text-[#0b4d77]">{asiento.numeroAsiento}</h2>
              <p className="mt-2 text-lg text-[#4661b0]">Registrado el {formatDate(asiento.fecha, true)}</p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 lg:items-end">
            <BalanceBadge balanceado={asiento.balanceado} />
            <p className="text-base text-[#4661b0]">Tipo de operacion: <span className="font-bold text-[#0b4d77]">{humanizeTipoOperacion(asiento.tipoOperacion)}</span></p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total debe" value={formatCurrency(asiento.totalDebe)} />
          <SummaryCard label="Total haber" value={formatCurrency(asiento.totalHaber)} accentClassName="text-[#109c9a]" />
          <SummaryCard label="Movimientos" value={String(asiento.detalles.length)} />
          <SummaryCard label="Operacion origen" value={asiento.idOperacionOrigen || "N/A"} accentClassName="text-[#109c9a]" />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <div className="rounded-[30px] bg-white p-6 shadow-[0_12px_34px_rgba(10,64,89,0.10)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-[#eef6fb] p-4 text-[#4a6eb0]"><FontAwesomeIcon icon={faTimeline} className="text-2xl" /></div>
              <div>
                <h3 className="text-2xl font-bold text-[#0b4d77]">Detalle del asiento</h3>
                <p className="text-base text-[#4661b0]">Cuentas afectadas, debitos, creditos y descripcion.</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-[24px] border border-[#dbe5ef]">
              <table className="min-w-full text-left">
                <thead><tr className="bg-linear-to-r from-[#109c9a] to-[#4a6eb0] text-white">
                  <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">Cuenta contable</th>
                  <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">Debito</th>
                  <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">Credito</th>
                  <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">Descripcion</th>
                </tr></thead>
                <tbody>
                  {asiento.detalles.map((detalle) => (
                    <tr key={detalle.id} className="border-b border-[#edf3fb] bg-white hover:bg-[#f8fbff]">
                      <td className="px-5 py-4"><div className="font-semibold text-[#0b3f70]">{detalle.cuentaContableNombre}</div><div className="text-sm text-[#6a7ea6]">{detalle.cuentaContableCodigo}</div></td>
                      <td className="px-5 py-4 font-semibold text-[#0b3f70]">{formatCurrency(detalle.montoDebe)}</td>
                      <td className="px-5 py-4 font-semibold text-[#109c9a]">{formatCurrency(detalle.montoHaber)}</td>
                      <td className="px-5 py-4 text-[#1f3f70]">{detalle.descripcion || asiento.descripcion || "Sin descripcion"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[30px] bg-white p-6 shadow-[0_12px_34px_rgba(10,64,89,0.10)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-[#eef6fb] p-4 text-[#4a6eb0]"><FontAwesomeIcon icon={faBookOpen} className="text-2xl" /></div>
                <div><h3 className="text-xl font-bold text-[#0b4d77]">Informacion general</h3><p className="text-sm text-[#4661b0]">Datos principales del asiento.</p></div>
              </div>
              <div className="grid gap-4">
                <DetailMetric label="Fecha" value={formatDate(asiento.fecha, true)} />
                <DetailMetric label="Numero" value={asiento.numeroAsiento} />
                <DetailMetric label="Descripcion" value={asiento.descripcion || "Sin descripcion"} />
                <DetailMetric label="Operacion" value={humanizeTipoOperacion(asiento.tipoOperacion)} />
              </div>
            </div>

            <div className="rounded-[30px] bg-white p-6 shadow-[0_12px_34px_rgba(10,64,89,0.10)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-[#eef6fb] p-4 text-[#4a6eb0]"><FontAwesomeIcon icon={faScaleBalanced} className="text-2xl" /></div>
                <div><h3 className="text-xl font-bold text-[#0b4d77]">Balance del asiento</h3><p className="text-sm text-[#4661b0]">Totales acumulados del movimiento.</p></div>
              </div>
              <div className="grid gap-4">
                <DetailMetric label="Total debe" value={formatCurrency(asiento.totalDebe)} />
                <DetailMetric label="Total haber" value={formatCurrency(asiento.totalHaber)} />
                <DetailMetric label="Estado" value={asiento.balanceado ? "Balanceado" : "No balanceado"} />
                <DetailMetric label="Operacion origen" value={asiento.idOperacionOrigen || "No disponible"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function LibroDiarioReport() {
  const today = useMemo(() => getTodayInputValue(), []);
  const [selectedPeriodoId, setSelectedPeriodoId] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [selectedAsientoId, setSelectedAsientoId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const periodosQuery = useListPeriodosContables();
  const periodOptions = useMemo<PeriodoFilterOption[]>(
    () =>
      (periodosQuery.data?.data ?? [])
        .map((periodo) => ({
          id: periodo.id,
          label: `${periodo.sucursalNombre} - ${formatPeriodoLabel(periodo)}`,
          fechaInicio: formatInputDate(periodo.fechaInicio),
          fechaFin: formatInputDate(periodo.fechaFin),
          periodoClave: periodo.periodoClave,
          estado: periodo.estado,
        }))
        .sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio) * -1),
    [periodosQuery.data?.data],
  );
  const selectedPeriodo = useMemo(
    () => periodOptions.find((option) => option.id === selectedPeriodoId) ?? null,
    [periodOptions, selectedPeriodoId],
  );
  const effectiveFechaInicio = selectedPeriodo ? selectedPeriodo.fechaInicio : fechaInicio;
  const effectiveFechaFin = selectedPeriodo ? selectedPeriodo.fechaFin : fechaFin;
  const invalidDateRange = Boolean(
    effectiveFechaInicio
    && effectiveFechaFin
    && effectiveFechaInicio > effectiveFechaFin,
  );
  const filters = useMemo<LibroDiarioFilters>(() => ({
    ...(selectedPeriodo?.periodoClave ? { periodoContable: selectedPeriodo.periodoClave } : {}),
    ...(effectiveFechaInicio ? { fechaInicio: effectiveFechaInicio } : {}),
    ...(effectiveFechaFin ? { fechaFin: effectiveFechaFin } : {}),
  }), [effectiveFechaFin, effectiveFechaInicio, selectedPeriodo?.periodoClave]);

  const libroDiarioQuery = useLibroDiario(filters, !invalidDateRange);
  const detailQuery = useLibroDiarioDetail(selectedAsientoId, Boolean(selectedAsientoId));
  const catalogoQuery = useCatalogoContableArbol();

  const cuentaLookup = useMemo(() => flattenCuentaLookup(catalogoQuery.data?.data ?? []), [catalogoQuery.data?.data]);
  const asientos = useMemo(() => (libroDiarioQuery.data ?? []).map((item) => hydrateAsiento(item, cuentaLookup)), [cuentaLookup, libroDiarioQuery.data]);
  const selectedAsiento = useMemo(() => detailQuery.data ? hydrateAsiento(detailQuery.data, cuentaLookup) : undefined, [cuentaLookup, detailQuery.data]);

  const rows = useMemo<LibroDiarioRow[]>(() => asientos.flatMap((asiento) =>
    asiento.detalles.map((detalle) => ({
      key: `${asiento.id}-${detalle.id}`,
      asientoId: asiento.id,
      fecha: asiento.fecha,
      numeroAsiento: asiento.numeroAsiento,
      descripcion: detalle.descripcion || asiento.descripcion,
      cuentaContableNombre: detalle.cuentaContableNombre,
      cuentaContableCodigo: detalle.cuentaContableCodigo,
      montoDebe: detalle.montoDebe,
      montoHaber: detalle.montoHaber,
      tipoOperacion: asiento.tipoOperacion,
    }))), [asientos]);

  const resumen = useMemo(() => ({
    totalAsientos: asientos.length,
    totalMovimientos: asientos.reduce((acc, asiento) => acc + asiento.detalles.length, 0),
    totalDebe: asientos.reduce((acc, asiento) => acc + asiento.totalDebe, 0),
    totalHaber: asientos.reduce((acc, asiento) => acc + asiento.totalHaber, 0),
  }), [asientos]);

  const totalPaginas = Math.ceil(rows.length / ITEMS_POR_PAGINA);
  const paginaSegura = totalPaginas === 0 ? 1 : Math.min(paginaActual, totalPaginas);
  const inicio = (paginaSegura - 1) * ITEMS_POR_PAGINA;
  const fin = inicio + ITEMS_POR_PAGINA;
  const rowsPaginados = rows.slice(inicio, fin);

  const applyRange = (nextFechaInicio: string, nextFechaFin: string) => {
    setPaginaActual(1);
    setSelectedPeriodoId("");
    setFechaInicio(nextFechaInicio);
    setFechaFin(nextFechaFin);
  };

  const resetFilters = () => {
    setPaginaActual(1);
    setSelectedPeriodoId("");
    setFechaInicio("");
    setFechaFin("");
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const file = await exportLibroDiarioPdf(filters);
      const url = window.URL.createObjectURL(file.blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = file.fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Libro diario exportado correctamente.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo exportar el libro diario.");
    } finally {
      setIsExporting(false);
    }
  };

  if (selectedAsientoId) {
    return (
      <LibroDiarioDetailView
        asiento={selectedAsiento}
        isLoading={detailQuery.isLoading}
        isError={detailQuery.isError}
        error={detailQuery.error}
        onBack={() => setSelectedAsientoId(null)}
      />
    );
  }

  return (
    <section className="p-6 h-full">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-start gap-4">
          <div className="rounded-[28px] bg-linear-to-br from-[#109c9a] to-[#4a6eb0] p-5 shadow-[0_10px_24px_rgba(10,64,89,0.16)]"><FontAwesomeIcon icon={faBookOpen} className="text-4xl text-white" /></div>
          <HeaderTitleAdmin {...libroDiarioHeader} />
        </div>

        <div className="rounded-[30px] bg-white p-6 shadow-[0_12px_34px_rgba(10,64,89,0.10)]">
          <div className="flex flex-col gap-4 border-b border-[#dbe5ef] pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#eef6fb] p-4 text-[#4a6eb0]"><FontAwesomeIcon icon={faFilter} className="text-2xl" /></div>
              <div><h3 className="text-2xl font-bold text-[#0b4d77]">Filtros del libro diario</h3><p className="text-base text-[#4661b0]">Consulta todos los asientos o limita el periodo contable.</p></div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={resetFilters} className="inline-flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-[#9adce2] px-5 py-3 text-base font-semibold text-[#0aa6a2] hover:bg-[#effafa]"><FontAwesomeIcon icon={faArrowRotateLeft} /> Restablecer</button>
              <button type="button" onClick={() => void handleExport()} disabled={isExporting || libroDiarioQuery.isLoading || invalidDateRange} className="inline-flex cursor-pointer items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#109c9a] to-[#4a6eb0] px-5 py-3 text-base font-semibold text-white shadow-[0_10px_24px_rgba(10,64,89,0.12)] disabled:cursor-not-allowed disabled:opacity-60"><FontAwesomeIcon icon={faDownload} /> {isExporting ? "Exportando..." : "Exportar PDF"}</button>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <label className="flex flex-col gap-3 md:col-span-3">
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
            <label className="flex flex-col gap-3">
              <span className="text-base font-semibold text-[#0b4d77]">Fecha inicial</span>
              <div className="flex items-center gap-3 rounded-2xl border border-[#cddaea] px-4 py-4 text-[#4661b0]"><FontAwesomeIcon icon={faCalendarDays} className="text-xl" /><input type="date" value={effectiveFechaInicio} onChange={(event) => { setPaginaActual(1); setSelectedPeriodoId(""); setFechaInicio(event.target.value); }} className="w-full bg-transparent text-lg outline-none" /></div>
            </label>
            <label className="flex flex-col gap-3">
              <span className="text-base font-semibold text-[#0b4d77]">Fecha final</span>
              <div className="flex items-center gap-3 rounded-2xl border border-[#cddaea] px-4 py-4 text-[#4661b0]"><FontAwesomeIcon icon={faCalendarDays} className="text-xl" /><input type="date" value={effectiveFechaFin} onChange={(event) => { setPaginaActual(1); setSelectedPeriodoId(""); setFechaFin(event.target.value); }} className="w-full bg-transparent text-lg outline-none" /></div>
            </label>
            {selectedPeriodo && (
              <div className="rounded-2xl bg-[#eef6fb] px-5 py-4 text-sm font-semibold text-[#2c5aa0]">
                Periodo seleccionado: {selectedPeriodo.label}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => applyRange(today, today)} className="cursor-pointer rounded-full bg-[#edf3fb] px-4 py-2 text-sm font-semibold text-[#4661b0] hover:bg-[#d9e7f5]">Hoy</button>
            <button type="button" onClick={() => applyRange(getMonthStart(today), today)} className="cursor-pointer rounded-full bg-[#edf3fb] px-4 py-2 text-sm font-semibold text-[#4661b0] hover:bg-[#d9e7f5]">Este mes</button>
            <button type="button" onClick={resetFilters} className="cursor-pointer rounded-full bg-[#0b4d77] px-4 py-2 text-sm font-semibold text-white hover:bg-[#093a5a]">Todos los periodos</button>
          </div>

          {invalidDateRange && <div className="mt-5 rounded-2xl border border-[#f2c1c1] bg-[#fff5f5] px-5 py-4 text-base text-[#b54747]">La fecha inicial no puede ser mayor que la fecha final.</div>}
          {periodosQuery.isLoading && <div className="mt-5 rounded-2xl bg-[#f8fbff] px-5 py-4 text-base text-[#4661b0]">Cargando catalogo de periodos contables...</div>}
          {periodosQuery.isError && <div className="mt-5 rounded-2xl border border-[#f2c1c1] bg-[#fff5f5] px-5 py-4 text-base text-[#b54747]">{periodosQuery.error?.message || "No se pudieron cargar los periodos contables."}</div>}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Asientos registrados" value={String(resumen.totalAsientos)} />
          <SummaryCard label="Movimientos contables" value={String(resumen.totalMovimientos)} accentClassName="text-[#109c9a]" />
          <SummaryCard label="Total debe" value={formatCurrency(resumen.totalDebe)} />
          <SummaryCard label="Total haber" value={formatCurrency(resumen.totalHaber)} accentClassName="text-[#109c9a]" />
        </div>

        <div className="mt-6 rounded-[30px] bg-white p-6 shadow-[0_12px_34px_rgba(10,64,89,0.10)]">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-[#eef6fb] p-4 text-[#4a6eb0]"><FontAwesomeIcon icon={faTimeline} className="text-2xl" /></div>
            <div><h3 className="text-2xl font-bold text-[#0b4d77]">Movimientos del libro diario</h3><p className="text-base text-[#4661b0]">Fecha, numero de asiento, cuenta contable, debito, credito y descripcion.</p></div>
          </div>

          {libroDiarioQuery.isLoading ? (
            <div className="rounded-2xl bg-[#f8fbff] px-6 py-10 text-lg font-semibold text-[#4661b0]">Cargando libro diario...</div>
          ) : libroDiarioQuery.isError ? (
            <div className="rounded-2xl bg-[#fff5f5] px-6 py-10 text-lg font-semibold text-[#b54747]">{libroDiarioQuery.error?.message || "No se pudo cargar el libro diario."}</div>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl bg-[#f8fbff] px-6 py-10 text-lg font-semibold text-[#4661b0]">No hay asientos contables para los filtros seleccionados.</div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-[24px] border border-[#dbe5ef]">
                <table className="min-w-full text-left">
                  <thead><tr className="bg-linear-to-r from-[#109c9a] to-[#4a6eb0] text-white">
                    <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">Fecha</th>
                    <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">No. asiento</th>
                    <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">Cuenta contable</th>
                    <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">Debito</th>
                    <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">Credito</th>
                    <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">Descripcion</th>
                    <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">Accion</th>
                  </tr></thead>
                  <tbody>
                    {rowsPaginados.map((row) => (
                      <tr key={row.key} className="border-b border-[#edf3fb] bg-white hover:bg-[#f8fbff]">
                        <td className="px-5 py-4 text-[#1f3f70]">{formatDate(row.fecha)}</td>
                        <td className="px-5 py-4"><div className="font-semibold text-[#0b3f70]">{row.numeroAsiento}</div><div className="text-sm text-[#6a7ea6]">{humanizeTipoOperacion(row.tipoOperacion)}</div></td>
                        <td className="px-5 py-4"><div className="font-medium text-[#0b3f70]">{row.cuentaContableNombre}</div><div className="text-sm text-[#6a7ea6]">{row.cuentaContableCodigo}</div></td>
                        <td className="px-5 py-4 font-semibold text-[#0b3f70]">{formatCurrency(row.montoDebe)}</td>
                        <td className="px-5 py-4 font-semibold text-[#109c9a]">{formatCurrency(row.montoHaber)}</td>
                        <td className="px-5 py-4 text-[#1f3f70]">{row.descripcion || "Sin descripcion"}</td>
                        <td className="px-5 py-4"><button type="button" onClick={() => setSelectedAsientoId(row.asientoId)} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#eff6ff] px-4 py-2 text-sm font-semibold text-[#2c5aa0] hover:bg-[#dcecff]"><FontAwesomeIcon icon={faEye} /> Ver detalle</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginacionComponent paginaActual={paginaSegura} totalPaginas={totalPaginas} action={setPaginaActual} inicio={inicio} fin={fin} registros={rows} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function formatPeriodoLabel(periodo: {
  sucursalNombre: string;
  fechaInicio: string;
  fechaFin: string;
  periodoClave: string;
}) {
  if (periodo.periodoClave) {
    return `${formatPeriodoContableLabel(periodo.periodoClave)} (${periodo.fechaInicio} a ${periodo.fechaFin})`;
  }

  return `${periodo.sucursalNombre} (${periodo.fechaInicio} a ${periodo.fechaFin})`;
}
