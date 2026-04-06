import { useMemo, useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faSackDollar,
    faTriangleExclamation,
    faBuilding,
    faRulerCombined,
    faNoteSticky,
} from "@fortawesome/free-solid-svg-icons";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";
import StatusNotification from "../../../components/notifications/StatusNotification";
import useMotivosSalida from "../../../hooks/InventarioHooks/useMotivosSalida";
import useRegistrarSalida from "../../../hooks/InventarioHooks/useRegistrarSalida";
import useListProduct from "../../../hooks/ProductosHooks/useListProduct";
import useAuth from "../../../hooks/useAuth";
import type { RegistrarSalidaForm } from "../../../interfaces/Inventario/InventarioInterface";
import { NotificacionData, type NotificationStateInterface } from "../../../interfaces/NotificacionesInterface";


type MotivoSalida = "VENTA" | "DANIO" | "CONSUMO_INTERNO" | "AJUSTE" | "OTRO";

const getNowDateTimeLocal = () => {
    const now = new Date();
    const timezoneOffsetInMs = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - timezoneOffsetInMs).toISOString().slice(0, 16);
};

export default function SalidasInventario() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [notification, setNotification] = useState<NotificationStateInterface>({...NotificacionData});

    const [form, setForm] = useState<RegistrarSalidaForm>({
        productoId: "",
        sucursalId: user?.sucursal.id ?? "",
        motivoSalida: "VENTA",
        detalleMotivo: "",
        cantidad: 0,
        fechaHora: getNowDateTimeLocal(),
        observaciones: "",
        usuarioId : user?.id ?? "",
    });

    const { data: motivosResponse } = useMotivosSalida();
    const { data: productsResponse } = useListProduct();
    const {
        mutateAsync: registrarSalida,
        isPending,
    } = useRegistrarSalida();

    const motivosSalida = (motivosResponse?.data ?? [
        "VENTA",
        "DANIO",
        "CONSUMO_INTERNO",
        "AJUSTE",
        "OTRO",
    ]) as MotivoSalida[];
    const productos = productsResponse?.data ?? [];

    const motivoMeta = useMemo(
        () => ({
            VENTA: {
                titulo: "Venta",
                descripcion: "Producto vendido a cliente",
                icono: faSackDollar,
            },
            DANIO: {
                titulo: "Daño",
                descripcion: "Producto dañado o defectuoso",
                icono: faTriangleExclamation,
            },
            CONSUMO_INTERNO: {
                titulo: "Consumo Interno",
                descripcion: "Uso interno de la empresa",
                icono: faBuilding,
            },
            AJUSTE: {
                titulo: "Ajuste",
                descripcion: "Correccion de inventario",
                icono: faRulerCombined,
            },
            OTRO: {
                titulo: "Otro",
                descripcion: "Otro motivo",
                icono: faNoteSticky,
            },
        }),
        [],
    );

    const onChangeField =
        (field: keyof RegistrarSalidaForm) =>
        (
            event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        ) => {
            const value = event.target.value;

            setForm((prev) => ({
                ...prev,
                [field]: field === "cantidad" ? Number(value) : value,
            }));
        };

    const onSelectMotivoSalida = (motivo: MotivoSalida) => {
        setForm((prev) => ({ ...prev, motivoSalida: motivo }));
    };

    const goBack = () => {
        navigate("/Inventario-Management");
    };

    const canSubmit =
        Boolean(form.productoId) &&
        Boolean(form.motivoSalida) &&
        form.cantidad > 0 &&
        Boolean(form.detalleMotivo.trim()) &&
        Boolean(form.fechaHora);

    const onSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!user?.sucursal.id) {
            setNotification({
                isVisible: true,
                variant: "error",
                title: "Sucursal no disponible",
                message: "No se encontro la sucursal del usuario autenticado.",
            });
            return;
        }

        if (form.cantidad <= 0) {
            setNotification({
                isVisible: true,
                variant: "error",
                title: "Cantidad invalida",
                message: "La cantidad debe ser mayor a 0.",
            });
            return;
        }

        try {
            const processed = await registrarSalida({
                ...form,
                sucursalId: user.sucursal.id,
            });

            if (processed) {
                setNotification({
                    isVisible: true,
                    variant: "success",
                    title: "Salida registrada - Asiento contable generado",
                    message: "La salida de inventario se registro correctamente.",
                });

                globalThis.setTimeout(() => {
                    navigate("/Inventario-Management");
                }, 1200);
                return;
            }

            setNotification({
                isVisible: true,
                variant: "error",
                title: "No se pudo registrar",
                message: "La operacion no pudo completarse. Intenta de nuevo.",
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Ocurrio un error inesperado al registrar la salida.";

            setNotification({
                isVisible: true,
                variant: "error",
                title: "Error al registrar salida",
                message: errorMessage,
            });
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

                <HeaderTitleAdmin
                    title="Registrar Salida de Productos"
                    subTitle="Completa el formulario para registrar una salida de inventario"
                />

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
                                Motivo de Salida <span className="text-[#ff4f4f]">*</span>
                            </p>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                {motivosSalida.map((motivo) => {
                                    const meta = motivoMeta[motivo];
                                    const isSelected = form.motivoSalida === motivo;

                                    return (
                                        <button
                                            key={motivo}
                                            type="button"
                                            onClick={() => onSelectMotivoSalida(motivo)}
                                            className={`cursor-pointer rounded-2xl border-2 p-4 text-left transition-colors ${
                                                isSelected
                                                    ? "border-[#0aa6a2] bg-[#e8f3f5]"
                                                    : "border-[#9adce2] bg-white hover:bg-[#edf8fa]"
                                            }`}
                                        >
                                            <div className="flex flex-col gap-1">
                                                <FontAwesomeIcon
                                                    icon={meta.icono}
                                                    className="text-3xl text-[#4661b0]"
                                                />
                                                <p className="text-[28px] font-bold text-[#0a4d76]">{meta.titulo}</p>
                                                <p className="text-sm text-[#4661b0]">{meta.descripcion}</p>
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
                                Detalle del Motivo <span className="text-[#ff4f4f]">*</span>
                            </p>
                            <input
                                required
                                type="text"
                                value={form.detalleMotivo}
                                onChange={onChangeField("detalleMotivo")}
                                placeholder="Ej: Venta, Producto danado, etc."
                                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
                            />
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
                                placeholder="Agregue cualquier nota o comentario adicional sobre esta salida"
                                className="w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 py-4 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
                            />
                        </div>

                        <div className="rounded-xl border-l-4 border-[#f0a74a] bg-[#fff7e9] p-5">
                            <div className="flex items-start gap-3">
                                <FontAwesomeIcon
                                    icon={faTriangleExclamation}
                                    className="pt-1 text-xl text-[#d67700]"
                                />
                                <div>
                                    <p className="text-2xl font-bold text-[#b35a00]">Informacion importante</p>
                                    <ul className="mt-2 list-disc space-y-1 pl-6 text-lg text-[#a14d00]">
                                        <li>El stock se reducira automaticamente al guardar.</li>
                                        <li>No se permiten salidas mayores al stock disponible.</li>
                                        <li>Este movimiento quedara registrado en el historial.</li>
                                        <li>Verifica que los datos sean correctos antes de guardar.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <ButtonsComponet
                            typeButton="button"
                            onClick={goBack}
                            disabled={isPending}
                            className="h-14 cursor-pointer rounded-2xl border-2 border-[#9adce2] bg-white text-2xl font-semibold text-[#4661b0] hover:bg-[#edf8fa] disabled:cursor-not-allowed disabled:opacity-70"
                            text="Cancelar"
                            icon=""
                        />

                        <ButtonsComponet
                            typeButton="submit"
                            onClick={() => null}
                            disabled={isPending || !canSubmit}
                            className={`inline-flex h-14 items-center justify-center gap-3 rounded-2xl text-2xl font-bold text-white disabled:cursor-not-allowed ${
                                isPending || !canSubmit
                                    ? "bg-[#c3c8d1]"
                                    : "cursor-pointer bg-linear-to-r from-[#0aa6a2] to-[#4661b0] hover:from-[#06706d] hover:to-[#334c8b]"
                            }`}
                            text={isPending ? "Registrando..." : "Registrar Salida"}
                            icon="fa-solid fa-floppy-disk"
                        />
                    </div>
                </form>
            </div>
        </section>
    );
}