import {
  useMemo,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowTrendUp,
} from "@fortawesome/free-solid-svg-icons";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";
import StatusNotification from "../../../components/notifications/StatusNotification";
import useTiposEntrada from "../../../hooks/InventarioHooks/useTiposEntrada";
import useRegistrarEntrada from "../../../hooks/InventarioHooks/useRegistrarEntrada";
import useListProduct from "../../../hooks/ProductosHooks/useListProduct";
import useListProveedores from "../../../hooks/ProveedoresHooks/useListProveedores";
import useAuth from "../../../hooks/useAuth";
import type { RegistrarEntradaForm } from "../../../interfaces/Inventario/InventarioInterface";
import {
  NotificacionData,
  type NotificationStateInterface,
} from "../../../interfaces/NotificacionesInterface";
import {
  botonCancelarEntrada,
  botonGuardarEntrada,
  informacionImpEntradaInventario,
  notificacionErorrRegistroEntrada,
  notificacionErrorSucursal,
  notificacionRegistroEntradaExitoso,
  tituloEntradaInventario,
} from "../../../data/dataAdministrator/EntradaInventarioData";
import InfImportante from "../../../components/informacionImportante/InfImportante";

type TipoEntrada = "REABASTECIMIENTO";

const getNowDateTimeLocal = () => {
  const now = new Date();
  const timezoneOffsetInMs = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - timezoneOffsetInMs)
    .toISOString()
    .slice(0, 16);
};

export default function EntradaInventario() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [notification, setNotification] = useState<NotificationStateInterface>({
    ...NotificacionData,
  });

  const [form, setForm] = useState<RegistrarEntradaForm>({
    productoId: "",
    sucursalId: user?.sucursal.id ?? "",
    tipoEntrada: "REABASTECIMIENTO",
    cantidad: 0,
    fechaHora: getNowDateTimeLocal(),
    proveedorId: "",
    observaciones: "",
    usuarioId: user?.id ?? "",
  });

  const { data: tiposResponse } = useTiposEntrada();
  const { data: productsResponse } = useListProduct();
  const { data: proveedoresResponse } = useListProveedores();
  const { mutateAsync: registrarEntrada, isPending } = useRegistrarEntrada();

  const tiposEntrada = (tiposResponse?.data ?? [
    "REABASTECIMIENTO",
  ]) as TipoEntrada[];
  const productos = productsResponse?.data ?? [];
  const proveedores = proveedoresResponse?.data ?? [];

  const tipoMeta = useMemo(
    () => ({
      REABASTECIMIENTO: {
        titulo: "Reabastecimiento",
        descripcion: "Surtido de inventario existente",
        icono: faArrowTrendUp,
      },
    }),
    [],
  );

  const onChangeField =
    (field: keyof RegistrarEntradaForm) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const value = event.target.value;

      setForm((prev) => ({
        ...prev,
        [field]: field === "cantidad" ? Number(value) : value,
      }));
    };

  const onSelectTipoEntrada = (tipo: TipoEntrada) => {
    setForm((prev) => ({ ...prev, tipoEntrada: tipo }));
  };

  const goBack = () => {
    navigate("/Inventario-Management");
  };

  const onSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?.sucursal.id) {
      setNotification({ ...notificacionErrorSucursal });
      return;
    }

    if (form.cantidad <= 0) {
      setNotification({ ...notificacionErrorSucursal });
      return;
    }

    try {
      const processed = await registrarEntrada({
        ...form,
        sucursalId: user.sucursal.id,
      });

      if (processed) {
        setNotification({ ...notificacionRegistroEntradaExitoso });
        globalThis.setTimeout(() => {
          navigate("/Inventario-Management");
        }, 1200);
        return;
      }

      setNotification({ ...notificacionErorrRegistroEntrada });
    } catch {
      setNotification({ ...notificacionErorrRegistroEntrada });
    }
  };

  return (
    <section className="w-full px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-220">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-2 text-base font-semibold text-[#0aa6a2] hover:text-[#06706d]"
          onClick={goBack}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
          <span className="text-[32px] leading-none">Volver a movimientos</span>
        </button>

        <HeaderTitleAdmin {...tituloEntradaInventario} />

        <StatusNotification
          isVisible={notification.isVisible}
          variant={notification.variant}
          title={notification.title}
          message={notification.message}
          onClose={() =>
            setNotification((prev) => ({
              ...prev,
              isVisible: false,
            }))
          }
        />

        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-2xl bg-[#f4f6f8] p-6 shadow-[0_6px_16px_rgba(0,0,0,0.1)] md:p-8"
        >
          <div className="space-y-6">
            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Producto <span className="text-[#ff4f4f]">*</span>
              </p>
              <select
                required
                value={form.productoId}
                onChange={onChangeField("productoId")}
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none focus:border-[#0aa6a2]"
              >
                <option value="">Seleccionar producto</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Tipo de Entrada <span className="text-[#ff4f4f]">*</span>
              </p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {tiposEntrada.map((tipo) => {
                  const meta = tipoMeta[tipo];
                  const isSelected = form.tipoEntrada === tipo;

                  return (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => onSelectTipoEntrada(tipo)}
                      className={`cursor-pointer rounded-2xl border-2 p-6 text-left transition-colors ${
                        isSelected
                          ? "border-[#0aa6a2] bg-[#e8f3f5]"
                          : "border-[#9adce2] bg-white hover:bg-[#edf8fa]"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2 text-center">
                        <FontAwesomeIcon
                          icon={meta.icono}
                          className="text-4xl text-[#4661b0]"
                        />
                        <p className="text-[30px] font-bold text-[#0a4d76]">
                          {meta.titulo}
                        </p>
                        <p className="text-base text-[#4661b0]">
                          {meta.descripcion}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Cantidad <span className="text-[#ff4f4f]">*</span>
              </p>
              <input
                required
                min={1}
                type="number"
                value={form.cantidad || ""}
                onChange={onChangeField("cantidad")}
                placeholder="Ingrese la cantidad"
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Fecha y Hora <span className="text-[#ff4f4f]">*</span>
              </p>
              <input
                required
                type="datetime-local"
                value={form.fechaHora}
                onChange={onChangeField("fechaHora")}
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none focus:border-[#0aa6a2]"
              />
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Proveedor <span className="text-[#ff4f4f]">*</span>
              </p>
              <select
                required
                value={form.proveedorId}
                onChange={onChangeField("proveedorId")}
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none focus:border-[#0aa6a2]"
              >
                <option value="">Seleccionar proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Usuario Responsable
              </p>
              <input
                type="text"
                value={user?.nombreCompleto ?? "Usuario Actual"}
                readOnly
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-[#edf8fa] px-5 text-xl text-[#4661b0] outline-none"
              />
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Observaciones (Opcional)
              </p>
              <textarea
                rows={4}
                value={form.observaciones ?? ""}
                onChange={onChangeField("observaciones")}
                placeholder="Agregue cualquier nota o comentario adicional sobre esta entrada"
                className="w-full rounded-2xl border-2 border-[#0aa6a2] bg-white px-5 py-4 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#06706d]"
              />
            </div>

            <InfImportante {...informacionImpEntradaInventario} />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <ButtonsComponet
              {...botonCancelarEntrada}
              onClick={goBack}
              disabled={isPending}
            />

            <ButtonsComponet
              {...botonGuardarEntrada}
              disabled={isPending}
              text={isPending ? "Guardando..." : "Guardar Entrada"}
            />
          </div>
        </form>
      </div>
    </section>
  );
}
