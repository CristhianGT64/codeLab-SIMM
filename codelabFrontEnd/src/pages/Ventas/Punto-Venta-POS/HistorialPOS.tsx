import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarDays,
  faEye,
  faMagnifyingGlass,
  faReceipt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import PaginacionComponent from "../../../components/Paginacion/PaginacionComponent";
import useVentaDetail from "../../../hooks/POSHooks/useVentaDetail";
import useVentasHistory from "../../../hooks/POSHooks/useVentasHistory";
import useAuth from "../../../hooks/useAuth";
import type { HeaderAdmin } from "../../../interfaces/Headers/HeaderInterface";
import type {
  VentaDetalle,
  VentaHistorialItem,
} from "../../../interfaces/POS/IVentasHistorial";

const ITEMS_POR_PAGINA = 6;

const historialHeader: HeaderAdmin = {
  title: "Historial de Ventas",
  subTitle: "Consulta y revisa todas las ventas registradas",
};

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const isAdministratorRole = (roleName: string) => {
  const normalized = normalizeText(roleName);
  return normalized === "administrator" || normalized === "administrador";
};

const formatCurrency = (value: number) =>
  `L ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDateTime = (value: string | null) => {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-HN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

const getCashierName = (
  venta: Pick<VentaHistorialItem, "nombreUsuario"> & {
    usuario?: VentaDetalle["usuario"];
  },
) =>
  venta.usuario?.nombreCompleto
  ?? venta.usuario?.usuario
  ?? venta.nombreUsuario
  ?? "Sin cajero";

const getProductsLabel = (count: number) =>
  count === 1 ? "1 producto" : `${count} productos`;

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

const HistorialDetalle = ({
  venta,
  onBack,
  isLoading,
  isError,
  error,
}: {
  venta: VentaDetalle | undefined;
  onBack: () => void;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}) => {
  const cashierName = venta ? getCashierName(venta) : "Sin cajero";

  if (isLoading) {
    return (
      <section className="p-6 h-full">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={onBack}
            className="mb-5 inline-flex cursor-pointer items-center gap-2 text-lg font-semibold text-[#0aa6a2] hover:text-[#06706d]"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Volver al Historial
          </button>

          <div className="rounded-[30px] bg-white p-10 shadow-[0_14px_40px_rgba(10,64,89,0.12)]">
            <p className="text-xl font-semibold text-[#4661b0]">
              Cargando detalle de la venta...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !venta) {
    return (
      <section className="p-6 h-full">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={onBack}
            className="mb-5 inline-flex cursor-pointer items-center gap-2 text-lg font-semibold text-[#0aa6a2] hover:text-[#06706d]"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Volver al Historial
          </button>

          <div className="rounded-[30px] bg-white p-10 shadow-[0_14px_40px_rgba(10,64,89,0.12)]">
            <p className="text-xl font-semibold text-[#c20000]">
              {error instanceof Error
                ? error.message
                : "No se pudo cargar el detalle de la venta."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="p-6 h-full">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-5 inline-flex cursor-pointer items-center gap-2 text-lg font-semibold text-[#0aa6a2] hover:text-[#06706d]"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Volver al Historial
        </button>

        <div className="overflow-hidden rounded-[30px] bg-white shadow-[0_14px_40px_rgba(10,64,89,0.12)]">
          <div className="flex items-start justify-between gap-6 bg-linear-to-r from-[#109c9a] to-[#4a6eb0] px-6 py-8 text-white">
            <div>
              <h2 className="text-4xl font-bold">{`Venta #${venta.id}`}</h2>
              <p className="mt-2 text-xl text-white/80">
                Detalle completo de la venta
              </p>
            </div>
            <div className="hidden rounded-2xl bg-white/12 p-4 sm:flex">
              <FontAwesomeIcon icon={faReceipt} className="text-4xl" />
            </div>
          </div>

          <div className="grid gap-5 border-b border-[#dbe5ef] px-6 py-6 md:grid-cols-3">
            <div className="rounded-2xl bg-[#f8fbff] p-4">
              <div className="flex items-center gap-3 text-[#4661b0]">
                <FontAwesomeIcon icon={faCalendarDays} />
                <span className="text-base font-medium">Fecha</span>
              </div>
              <p className="mt-3 text-2xl font-bold text-[#0b4d77]">
                {formatDateTime(venta.createdAt)}
              </p>
            </div>

            <div className="rounded-2xl bg-[#f8fbff] p-4">
              <div className="flex items-center gap-3 text-[#4661b0]">
                <FontAwesomeIcon icon={faUser} />
                <span className="text-base font-medium">Cajero</span>
              </div>
              <p className="mt-3 text-2xl font-bold text-[#0b4d77]">
                {cashierName}
              </p>
            </div>

            <div className="rounded-2xl bg-[#f8fbff] p-4">
              <div className="flex items-center gap-3 text-[#4661b0]">
                <FontAwesomeIcon icon={faReceipt} />
                <span className="text-base font-medium">Total</span>
              </div>
              <p className="mt-3 text-3xl font-bold text-[#0aa6a2]">
                {formatCurrency(venta.total)}
              </p>
            </div>
          </div>

          <div className="px-6 py-7">
            <h3 className="text-3xl font-bold text-[#0b4d77]">
              Productos Vendidos
            </h3>

            <div className="mt-5 overflow-x-auto rounded-2xl border border-[#dbe5ef]">
              <table className="w-full min-w-[820px]">
                <thead>
                  <tr className="bg-[#f4f8fc] text-left text-[#0b4d77]">
                    <th className="px-4 py-4 text-lg font-semibold">Codigo</th>
                    <th className="px-4 py-4 text-lg font-semibold">Producto</th>
                    <th className="px-4 py-4 text-lg font-semibold text-center">
                      Cantidad
                    </th>
                    <th className="px-4 py-4 text-lg font-semibold text-right">
                      Precio Unit.
                    </th>
                    <th className="px-4 py-4 text-lg font-semibold text-right">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {venta.detalles.map((detalle) => (
                    <tr
                      key={detalle.id}
                      className="border-t border-[#dbe5ef] text-[#24364d]"
                    >
                      <td className="px-4 py-4 text-lg text-[#4661b0]">
                        {detalle.producto?.sku ?? detalle.productoId}
                      </td>
                      <td className="px-4 py-4 text-xl font-medium text-[#0b4d77]">
                        {detalle.producto?.nombre ?? "Producto sin nombre"}
                      </td>
                      <td className="px-4 py-4 text-center text-lg">
                        {detalle.cantidad}
                      </td>
                      <td className="px-4 py-4 text-right text-lg text-[#4661b0]">
                        {formatCurrency(detalle.precioUnitario)}
                      </td>
                      <td className="px-4 py-4 text-right text-xl font-bold text-[#0aa6a2]">
                        {formatCurrency(detalle.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-[#dbe5ef] bg-[#fbfdff] px-6 py-6">
            <div className="ml-auto flex max-w-md flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#dbe5ef] pb-4 text-xl text-[#4661b0]">
                <span>Subtotal:</span>
                <span className="font-bold text-[#0b4d77]">
                  {formatCurrency(venta.subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-3xl font-bold text-[#0b4d77]">
                <span>Total:</span>
                <span className="text-[#0aa6a2]">
                  {formatCurrency(venta.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function HistorialPOS() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [selectedVentaId, setSelectedVentaId] = useState<string | null>(null);

  const isAdministrator = isAdministratorRole(user?.rol?.nombre ?? "");

  const ventasQuery = useVentasHistory({
    usuarioId: isAdministrator ? undefined : user?.id,
    enabled: !isAuthLoading && Boolean(user),
  });
  const ventaDetalleQuery = useVentaDetail(
    selectedVentaId,
    !isAuthLoading && Boolean(user),
  );

  const ventas = useMemo<VentaHistorialItem[]>(
    () => ventasQuery.data ?? [],
    [ventasQuery.data],
  );

  const resumen = useMemo(
    () => ({
      totalVentas: ventas.length,
      totalRecaudado: ventas.reduce((acc, venta) => acc + venta.total, 0),
    }),
    [ventas],
  );

  const ventasFiltradas = useMemo(() => {
    const normalizedTerm = normalizeText(searchTerm);

    if (!normalizedTerm) {
      return ventas;
    }

    return ventas.filter((venta) => {
      const searchableText = [
        venta.id,
        `#${venta.id}`,
        getCashierName(venta),
      ]
        .map((value) => normalizeText(value))
        .join(" ");

      return searchableText.includes(normalizedTerm);
    });
  }, [searchTerm, ventas]);

  const totalPaginas = Math.ceil(ventasFiltradas.length / ITEMS_POR_PAGINA);
  const paginaSegura = totalPaginas === 0 ? 1 : Math.min(paginaActual, totalPaginas);
  const inicio = (paginaSegura - 1) * ITEMS_POR_PAGINA;
  const fin = inicio + ITEMS_POR_PAGINA;
  const ventasPaginadas = ventasFiltradas.slice(inicio, fin);

  const irAPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
    }
  };

  if (selectedVentaId) {
    return (
      <HistorialDetalle
        venta={ventaDetalleQuery.data}
        onBack={() => setSelectedVentaId(null)}
        isLoading={ventaDetalleQuery.isLoading}
        isError={ventaDetalleQuery.isError}
        error={ventaDetalleQuery.error}
      />
    );
  }

  if (isAuthLoading) {
    return (
      <section className="p-6 h-full">
        <div className="mx-auto max-w-7xl rounded-[30px] bg-white p-8 shadow-[0_10px_30px_rgba(10,64,89,0.10)]">
          <p className="text-xl font-semibold text-[#4661b0]">
            Cargando informacion del usuario...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="p-6 h-full">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-start gap-4">
          <div className="rounded-[28px] bg-linear-to-br from-[#109c9a] to-[#4a6eb0] p-5 shadow-[0_10px_24px_rgba(10,64,89,0.16)]">
            <FontAwesomeIcon icon={faReceipt} className="text-4xl text-white" />
          </div>
          <HeaderTitleAdmin {...historialHeader} />
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(240px,0.8fr)_minmax(260px,1fr)]">
          <div className="rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(10,64,89,0.10)]">
            <label className="flex items-center gap-3 rounded-2xl border-2 border-[#9adce2] bg-white px-4 py-4">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-2xl text-[#4661b0]"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setPaginaActual(1);
                }}
                placeholder="Buscar por numero de venta o cajero..."
                className="w-full bg-transparent text-xl text-[#4661b0] outline-none placeholder:text-[#8a94ad]"
              />
            </label>
          </div>

          <SummaryCard label="Total Ventas" value={String(resumen.totalVentas)} />
          <SummaryCard
            label="Total Recaudado"
            value={formatCurrency(resumen.totalRecaudado)}
            accentClassName="text-[#0aa6a2]"
          />
        </div>

        <div className="mt-8 overflow-hidden rounded-[30px] bg-white shadow-[0_12px_34px_rgba(10,64,89,0.10)]">
          <div className="border-b border-[#dbe5ef] px-6 py-6">
            <h3 className="text-3xl font-bold text-[#0b4d77]">
              Ventas Registradas
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="bg-linear-to-r from-[#109c9a] to-[#4a6eb0] text-left text-white">
                  <th className="px-6 py-4 text-xl font-semibold">No. Venta</th>
                  <th className="px-6 py-4 text-xl font-semibold">Fecha</th>
                  <th className="px-6 py-4 text-xl font-semibold">Cajero</th>
                  <th className="px-6 py-4 text-xl font-semibold">Productos</th>
                  <th className="px-6 py-4 text-xl font-semibold">Total</th>
                  <th className="px-6 py-4 text-xl font-semibold text-center">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {ventasQuery.isLoading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-xl text-[#4661b0]">
                      Cargando historial de ventas...
                    </td>
                  </tr>
                )}

                {!ventasQuery.isLoading && ventasQuery.isError && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-xl text-[#c20000]">
                      {ventasQuery.error instanceof Error
                        ? ventasQuery.error.message
                        : "No se pudo cargar el historial de ventas."}
                    </td>
                  </tr>
                )}

                {!ventasQuery.isLoading &&
                  !ventasQuery.isError &&
                  ventasFiltradas.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-xl text-[#6a758f]">
                        No hay ventas para mostrar.
                      </td>
                    </tr>
                  )}

                {!ventasQuery.isLoading &&
                  !ventasQuery.isError &&
                  ventasPaginadas.map((venta) => (
                    <tr
                      key={venta.id}
                      className="border-b border-[#dbe5ef] text-[#24364d] last:border-b-0"
                    >
                      <td className="px-6 py-5 text-2xl font-bold text-[#0b4d77]">
                        {`#${venta.id}`}
                      </td>
                      <td className="px-6 py-5 text-xl text-[#4661b0]">
                        {formatDateTime(venta.createdAt)}
                      </td>
                      <td className="px-6 py-5 text-xl text-[#0b4d77]">
                        <div className="flex items-center gap-3">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="text-[#4661b0]"
                          />
                          <span>{getCashierName(venta)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-xl text-[#4661b0]">
                        {getProductsLabel(venta.productosCount)}
                      </td>
                      <td className="px-6 py-5 text-2xl font-bold text-[#0aa6a2]">
                        {formatCurrency(venta.total)}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedVentaId(venta.id)}
                          className="inline-flex cursor-pointer items-center gap-3 rounded-2xl bg-[#0aa6a2] px-5 py-3 text-lg font-semibold text-white hover:bg-[#06706d]"
                        >
                          <FontAwesomeIcon icon={faEye} />
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {ventasFiltradas.length > 0 && (
          <PaginacionComponent
            paginaActual={paginaSegura}
            totalPaginas={totalPaginas}
            action={irAPagina}
            inicio={inicio}
            fin={fin}
            registros={ventasFiltradas}
          />
        )}
      </div>
    </section>
  );
}
