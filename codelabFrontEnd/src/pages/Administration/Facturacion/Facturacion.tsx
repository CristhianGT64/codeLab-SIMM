import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRotateLeft,
  faBan,
  faBuilding,
  faCalendarDays,
  faCircleCheck,
  faDownload,
  faEye,
  faFileInvoiceDollar,
  faFilter,
  faReceipt,
  faTriangleExclamation,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import PaginacionComponent from "../../../components/Paginacion/PaginacionComponent";
import useFacturaDetail from "../../../hooks/FacturasHooks/useFacturaDetail";
import useFacturasHistory from "../../../hooks/FacturasHooks/useFacturasHistory";
import { useClients } from "../../../hooks/ClientesHooks/useClients";
import useListSucursales from "../../../hooks/SucursalesHooks/useListSucursales";
import type { Client } from "../../../interfaces/Clients/ClientInterface";
import type {
  FacturaEstado,
  FacturaHistorialDetail,
  FacturaHistorialFilters,
  FacturaHistorialItem,
} from "../../../interfaces/Facturas/IFacturasHistorial";
import type { HeaderAdmin } from "../../../interfaces/Headers/HeaderInterface";
import type { Sucursal } from "../../../interfaces/Sucursales/SucursalInterface";
import { exportFacturas } from "../../../services/FacturaService";
import { toast } from "sonner";

const ITEMS_POR_PAGINA = 6;

const facturasHeader: HeaderAdmin = {
  title: "Historial de Facturacion",
  subTitle: "Consulta facturas emitidas, revisa su detalle completo y exporta el historial.",
};

const statusStyles: Record<FacturaEstado, string> = {
  pagada: "bg-[#e8f8f2] text-[#127a52]",
  pendiente: "bg-[#fff4df] text-[#b7791f]",
  anulada: "bg-[#fde8e8] text-[#c53030]",
};

const statusIcons = {
  pagada: faCircleCheck,
  pendiente: faTriangleExclamation,
  anulada: faBan,
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

  return new Intl.DateTimeFormat("es-HN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const formatDateTime = (value: string | null) => {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-HN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const StatusBadge = ({ estado }: { estado: FacturaEstado }) => (
  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[estado]}`}>
    <FontAwesomeIcon icon={statusIcons[estado]} />
    {estado.charAt(0).toUpperCase() + estado.slice(1)}
  </span>
);

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

const DetailMetric = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="rounded-2xl border border-[#dbe5ef] bg-[#f8fbff] px-4 py-4">
    <p className="text-sm font-semibold uppercase tracking-wide text-[#4661b0]">
      {label}
    </p>
    <p className="mt-2 text-xl font-bold text-[#0b3f70]">{value}</p>
  </div>
);

const FacturaDetailView = ({
  numeroFactura,
  factura,
  isLoading,
  isError,
  error,
  onBack,
}: {
  numeroFactura: string | null;
  factura: FacturaHistorialDetail | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onBack: () => void;
}) => {
  if (isLoading) {
    return (
      <section className="p-6 h-full">
        <div className="mx-auto max-w-7xl">
          <button
            type="button"
            onClick={onBack}
            className="mb-5 inline-flex cursor-pointer items-center gap-2 text-lg font-semibold text-[#0aa6a2] hover:text-[#06706d]"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Volver al historial
          </button>

          <div className="rounded-[30px] bg-white p-10 shadow-[0_14px_40px_rgba(10,64,89,0.12)]">
            <p className="text-xl font-semibold text-[#4661b0]">
              Cargando detalle de la factura...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !factura) {
    return (
      <section className="p-6 h-full">
        <div className="mx-auto max-w-7xl">
          <button
            type="button"
            onClick={onBack}
            className="mb-5 inline-flex cursor-pointer items-center gap-2 text-lg font-semibold text-[#0aa6a2] hover:text-[#06706d]"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Volver al historial
          </button>

          <div className="rounded-[30px] bg-white p-10 shadow-[0_14px_40px_rgba(10,64,89,0.12)]">
            <h3 className="text-2xl font-bold text-[#0b4d77]">
              No pudimos cargar el detalle
            </h3>
            <p className="mt-3 text-lg text-[#4661b0]">
              {error instanceof Error
                ? error.message
                : `No se encontro informacion para la factura ${numeroFactura ?? ""}.`}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="p-6 h-full">
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-5 inline-flex cursor-pointer items-center gap-2 text-lg font-semibold text-[#0aa6a2] hover:text-[#06706d]"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Volver al historial
        </button>

        <div className="mb-8 flex flex-col gap-4 rounded-[30px] bg-white p-6 shadow-[0_14px_40px_rgba(10,64,89,0.12)] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-[28px] bg-linear-to-br from-[#109c9a] to-[#4a6eb0] p-5 shadow-[0_10px_24px_rgba(10,64,89,0.16)]">
              <FontAwesomeIcon icon={faReceipt} className="text-4xl text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4661b0]">
                Factura emitida
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#0b4d77]">
                {factura.numeroFactura}
              </h2>
              <p className="mt-2 text-lg text-[#4661b0]">
                Emitida el {formatDateTime(factura.fechaEmision)}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 lg:items-end">
            <StatusBadge estado={factura.estadoFactura} />
            <p className="text-base text-[#4661b0]">
              Total facturado:{" "}
              <span className="font-bold text-[#0b4d77]">
                {formatCurrency(factura.totales.total)}
              </span>
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <SummaryCard label="Total de la factura" value={formatCurrency(factura.totales.total)} />
          <SummaryCard
            label="Saldo pendiente"
            value={formatCurrency(factura.saldoPendiente)}
            accentClassName={factura.saldoPendiente > 0 ? "text-[#b7791f]" : "text-[#127a52]"}
          />
          <SummaryCard
            label="Lineas registradas"
            value={String(factura.detalles.length)}
            accentClassName="text-[#109c9a]"
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <div className="rounded-[30px] bg-white p-6 shadow-[0_12px_34px_rgba(10,64,89,0.10)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-[#eef6fb] p-4 text-[#4a6eb0]">
                <FontAwesomeIcon icon={faReceipt} className="text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#0b4d77]">
                  Detalle completo de la factura
                </h3>
                <p className="text-base text-[#4661b0]">
                  Productos, impuestos y subtotales registrados.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-[24px] border border-[#dbe5ef]">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-linear-to-r from-[#109c9a] to-[#4a6eb0] text-white">
                    <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">
                      Producto
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">
                      Cantidad
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">
                      Precio unitario
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">
                      Impuesto
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {factura.detalles.map((detalle) => (
                    <tr key={detalle.id} className="border-b border-[#edf3fb] bg-white hover:bg-[#f8fbff]">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-[#0b3f70]">{detalle.producto}</div>
                        <div className="text-sm text-[#6a7ea6]">{detalle.tipoImpuesto}</div>
                      </td>
                      <td className="px-5 py-4 text-[#1f3f70]">{detalle.cantidad}</td>
                      <td className="px-5 py-4 text-[#1f3f70]">
                        {formatCurrency(detalle.precioUnitario)}
                      </td>
                      <td className="px-5 py-4 text-[#1f3f70]">
                        {formatCurrency(detalle.montoImpuesto)}
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#0b3f70]">
                        {formatCurrency(detalle.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[30px] bg-white p-6 shadow-[0_12px_34px_rgba(10,64,89,0.10)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-[#eef6fb] p-4 text-[#4a6eb0]">
                  <FontAwesomeIcon icon={faUser} className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0b4d77]">Cliente y emision</h3>
                  <p className="text-sm text-[#4661b0]">
                    Datos asociados al documento fiscal.
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <DetailMetric
                  label="Cliente"
                  value={factura.cliente?.nombre || "Consumidor Final"}
                />
                <DetailMetric
                  label="Identificacion"
                  value={factura.cliente?.identificacion || "No registrada"}
                />
                <DetailMetric
                  label="Usuario"
                  value={factura.usuario?.nombre || "No disponible"}
                />
                <DetailMetric
                  label="Estado"
                  value={factura.estadoFactura.charAt(0).toUpperCase() + factura.estadoFactura.slice(1)}
                />
              </div>
            </div>

            <div className="rounded-[30px] bg-white p-6 shadow-[0_12px_34px_rgba(10,64,89,0.10)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-[#eef6fb] p-4 text-[#4a6eb0]">
                  <FontAwesomeIcon icon={faBuilding} className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0b4d77]">Sucursal y CAI</h3>
                  <p className="text-sm text-[#4661b0]">
                    Referencia de la sucursal y autorizacion vigente.
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <DetailMetric
                  label="Sucursal"
                  value={factura.sucursal?.nombre || "Sin sucursal"}
                />
                <DetailMetric
                  label="Direccion"
                  value={factura.sucursal?.direccion || "No disponible"}
                />
                <DetailMetric
                  label="CAI"
                  value={factura.cai?.codigo || "No disponible"}
                />
                <DetailMetric
                  label="Limite de emision"
                  value={formatDate(factura.cai?.fechaLimite ?? null)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[30px] bg-white p-6 shadow-[0_12px_34px_rgba(10,64,89,0.10)]">
          <div className="mb-5">
            <h3 className="text-2xl font-bold text-[#0b4d77]">Totales e impuestos</h3>
            <p className="text-base text-[#4661b0]">
              Desglose financiero de la factura seleccionada.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <DetailMetric label="Exento" value={formatCurrency(factura.totales.exento)} />
            <DetailMetric label="Gravado 15%" value={formatCurrency(factura.totales.gravado15)} />
            <DetailMetric label="Gravado 18%" value={formatCurrency(factura.totales.gravado18)} />
            <DetailMetric label="ISV 15%" value={formatCurrency(factura.totales.isv15)} />
            <DetailMetric label="ISV 18%" value={formatCurrency(factura.totales.isv18)} />
            <DetailMetric label="Total" value={formatCurrency(factura.totales.total)} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Facturacion() {
  const [clienteId, setClienteId] = useState("");
  const [sucursalId, setSucursalId] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [selectedNumeroFactura, setSelectedNumeroFactura] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const invalidDateRange = Boolean(fechaInicio && fechaFin && fechaInicio > fechaFin);

  const filters = useMemo<FacturaHistorialFilters>(
    () => ({
      ...(clienteId ? { clienteId } : {}),
      ...(sucursalId ? { sucursalId } : {}),
      ...(fechaInicio ? { fechaInicio } : {}),
      ...(fechaFin ? { fechaFin } : {}),
    }),
    [clienteId, sucursalId, fechaInicio, fechaFin],
  );

  const historyQuery = useFacturasHistory(filters, !invalidDateRange);
  const detailQuery = useFacturaDetail(selectedNumeroFactura, Boolean(selectedNumeroFactura));
  const clientsQuery = useClients();
  const sucursalesQuery = useListSucursales();

  const clientes = useMemo<Client[]>(
    () => clientsQuery.data ?? [],
    [clientsQuery.data],
  );

  const sucursales = useMemo<Sucursal[]>(
    () => sucursalesQuery.data?.data ?? [],
    [sucursalesQuery.data],
  );

  const facturas = useMemo<FacturaHistorialItem[]>(
    () => historyQuery.data ?? [],
    [historyQuery.data],
  );
  const totalPaginas = Math.ceil(facturas.length / ITEMS_POR_PAGINA);
  const paginaSegura = totalPaginas === 0 ? 1 : Math.min(paginaActual, totalPaginas);
  const inicio = (paginaSegura - 1) * ITEMS_POR_PAGINA;
  const fin = inicio + ITEMS_POR_PAGINA;
  const facturasPaginadas = facturas.slice(inicio, fin);

  const resumen = useMemo(() => {
    const cantidad = facturas.length;
    const totalFacturado = facturas.reduce(
      (acc, factura) => acc + factura.totales.total,
      0,
    );
    const pagadas = facturas.filter((factura) => factura.estadoFactura === "pagada").length;
    const pendientes = facturas.filter((factura) => factura.estadoFactura === "pendiente").length;
    const anuladas = facturas.filter((factura) => factura.estadoFactura === "anulada").length;

    return {
      cantidad,
      totalFacturado,
      pagadas,
      pendientes,
      anuladas,
    };
  }, [facturas]);

  const resetFilters = () => {
    setClienteId("");
    setSucursalId("");
    setFechaInicio("");
    setFechaFin("");
    setPaginaActual(1);
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const file = await exportFacturas(filters);
      const url = window.URL.createObjectURL(file.blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = file.fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Historial exportado correctamente.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo exportar el historial de facturacion.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  if (selectedNumeroFactura) {
    return (
      <FacturaDetailView
        numeroFactura={selectedNumeroFactura}
        factura={detailQuery.data}
        isLoading={detailQuery.isLoading}
        isError={detailQuery.isError}
        error={detailQuery.error}
        onBack={() => setSelectedNumeroFactura(null)}
      />
    );
  }

  return (
    <section className="p-6 h-full">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-start gap-4">
          <div className="rounded-[28px] bg-linear-to-br from-[#109c9a] to-[#4a6eb0] p-5 shadow-[0_10px_24px_rgba(10,64,89,0.16)]">
            <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-4xl text-white" />
          </div>
          <HeaderTitleAdmin {...facturasHeader} />
        </div>

        <div className="rounded-[30px] bg-white p-6 shadow-[0_12px_34px_rgba(10,64,89,0.10)]">
          <div className="flex flex-col gap-4 border-b border-[#dbe5ef] pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#eef6fb] p-4 text-[#4a6eb0]">
                <FontAwesomeIcon icon={faFilter} className="text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#0b4d77]">Filtros del historial</h3>
                <p className="text-base text-[#4661b0]">
                  Consulta por cliente, sucursal o rango de fechas.
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
                disabled={isExporting || historyQuery.isLoading || invalidDateRange}
                className="inline-flex cursor-pointer items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#109c9a] to-[#4a6eb0] px-5 py-3 text-base font-semibold text-white shadow-[0_10px_24px_rgba(10,64,89,0.12)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FontAwesomeIcon icon={faDownload} />
                {isExporting ? "Exportando..." : "Exportar historial"}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <label className="flex flex-col gap-3">
              <span className="text-base font-semibold text-[#0b4d77]">Cliente</span>
              <div className="flex items-center gap-3 rounded-2xl border border-[#cddaea] px-4 py-4 text-[#4661b0]">
                <FontAwesomeIcon icon={faUser} className="text-xl" />
                <select
                  value={clienteId}
                  onChange={(event) => {
                    setPaginaActual(1);
                    setClienteId(event.target.value);
                  }}
                  className="w-full bg-transparent text-lg outline-none"
                >
                  <option value="">Todos los clientes</option>
                  {clientes.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.nombreCompleto}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <label className="flex flex-col gap-3">
              <span className="text-base font-semibold text-[#0b4d77]">Sucursal</span>
              <div className="flex items-center gap-3 rounded-2xl border border-[#cddaea] px-4 py-4 text-[#4661b0]">
                <FontAwesomeIcon icon={faBuilding} className="text-xl" />
                <select
                  value={sucursalId}
                  onChange={(event) => {
                    setPaginaActual(1);
                    setSucursalId(event.target.value);
                  }}
                  className="w-full bg-transparent text-lg outline-none"
                >
                  <option value="">Todas las sucursales</option>
                  {sucursales.map((sucursal) => (
                    <option key={sucursal.id} value={sucursal.id}>
                      {sucursal.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </label>

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

          {invalidDateRange && (
            <div className="mt-5 rounded-2xl border border-[#f2c1c1] bg-[#fff5f5] px-5 py-4 text-base text-[#b54747]">
              La fecha inicial no puede ser mayor que la fecha final.
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Facturas emitidas" value={String(resumen.cantidad)} />
          <SummaryCard
            label="Total facturado"
            value={formatCurrency(resumen.totalFacturado)}
            accentClassName="text-[#109c9a]"
          />
          <SummaryCard
            label="Pagadas / Pendientes"
            value={`${resumen.pagadas} / ${resumen.pendientes}`}
            accentClassName="text-[#0b4d77]"
          />
          <SummaryCard
            label="Anuladas"
            value={String(resumen.anuladas)}
            accentClassName="text-[#c53030]"
          />
        </div>

        <div className="mt-6 rounded-[30px] bg-white p-6 shadow-[0_12px_34px_rgba(10,64,89,0.10)]">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-[#eef6fb] p-4 text-[#4a6eb0]">
              <FontAwesomeIcon icon={faReceipt} className="text-2xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#0b4d77]">
                Facturas emitidas
              </h3>
              <p className="text-base text-[#4661b0]">
                Numero de factura, fecha, cliente, sucursal, monto y estado.
              </p>
            </div>
          </div>

          {historyQuery.isLoading ? (
            <div className="rounded-2xl bg-[#f8fbff] px-6 py-10 text-lg font-semibold text-[#4661b0]">
              Cargando historial de facturacion...
            </div>
          ) : historyQuery.isError ? (
            <div className="rounded-2xl bg-[#fff5f5] px-6 py-10 text-lg font-semibold text-[#b54747]">
              {historyQuery.error?.message || "No se pudo cargar el historial de facturacion."}
            </div>
          ) : facturas.length === 0 ? (
            <div className="rounded-2xl bg-[#f8fbff] px-6 py-10 text-lg font-semibold text-[#4661b0]">
              No hay facturas para los filtros seleccionados.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-[24px] border border-[#dbe5ef]">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="bg-linear-to-r from-[#109c9a] to-[#4a6eb0] text-white">
                      <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">
                        No. factura
                      </th>
                      <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">
                        Fecha de emision
                      </th>
                      <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">
                        Cliente
                      </th>
                      <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">
                        Sucursal
                      </th>
                      <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">
                        Total
                      </th>
                      <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">
                        Estado
                      </th>
                      <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide">
                        Accion
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {facturasPaginadas.map((factura: FacturaHistorialItem) => (
                      <tr
                        key={factura.facturaId}
                        className="border-b border-[#edf3fb] bg-white hover:bg-[#f8fbff]"
                      >
                        <td className="px-5 py-4">
                          <div className="font-semibold text-[#0b3f70]">
                            {factura.numeroFactura}
                          </div>
                          <div className="text-sm text-[#6a7ea6]">
                            {factura.detallesCount} lineas
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[#1f3f70]">
                          {formatDate(factura.fechaEmision)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-medium text-[#0b3f70]">
                            {factura.cliente?.nombre || "Consumidor Final"}
                          </div>
                          <div className="text-sm text-[#6a7ea6]">
                            {factura.cliente?.identificacion || "Sin identificacion"}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[#1f3f70]">
                          {factura.sucursal?.nombre || "Sin sucursal"}
                        </td>
                        <td className="px-5 py-4 font-semibold text-[#0b3f70]">
                          {formatCurrency(factura.totales.total)}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge estado={factura.estadoFactura} />
                        </td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => setSelectedNumeroFactura(factura.numeroFactura)}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#eff6ff] px-4 py-2 text-sm font-semibold text-[#2c5aa0] hover:bg-[#dcecff]"
                          >
                            <FontAwesomeIcon icon={faEye} />
                            Ver detalle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {facturas.length > 0 && (
                <PaginacionComponent
                  paginaActual={paginaSegura}
                  totalPaginas={totalPaginas}
                  action={setPaginaActual}
                  inicio={inicio}
                  fin={fin}
                  registros={facturas}
                />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
