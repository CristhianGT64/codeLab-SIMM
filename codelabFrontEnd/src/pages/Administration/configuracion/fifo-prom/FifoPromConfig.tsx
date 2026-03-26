import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBoxesStacked,
  faCheck,
  faScaleBalanced,
  faTriangleExclamation,
  faWaveSquare,
} from "@fortawesome/free-solid-svg-icons";
import HeaderTitleAdmin from "../../../../components/headers/HeaderAdmin";
import ButtonsComponet from "../../../../components/buttonsComponents/ButtonsComponet";
import InfImportante from "../../../../components/informacionImportante/InfImportante";
import StatusNotification from "../../../../components/notifications/StatusNotification";
import useMetodoInventario from "../../../../hooks/ConfiguracionHooks/useMetodoInventario";
import useOpcionesMetodoInventario from "../../../../hooks/ConfiguracionHooks/useOpcionesMetodoInventario";
import useUpdateMetodoInventario from "../../../../hooks/ConfiguracionHooks/useUpdateMetodoInventario";
import {
  NotificacionData,
  type NotificationStateInterface,
} from "../../../../interfaces/NotificacionesInterface";
import type { UpdateMetodoInventarioForm } from "../../../../interfaces/Configuracion/MetodoInventarioInterface";
import type { HeaderAdmin } from "../../../../interfaces/Headers/HeaderInterface";

type MetodoValuacion = UpdateMetodoInventarioForm["metodoValuacion"];

const METODO_META: Record<
  MetodoValuacion,
  {
    titulo: string;
    subtitulo: string;
    descripcion: string;
    icono: typeof faScaleBalanced;
  }
> = {
  FIFO: {
    titulo: "FIFO (PEPS)",
    subtitulo: "First In, First Out",
    descripcion: "Valora primero las unidades mas antiguas en inventario.",
    icono: faBoxesStacked,
  },
  PROMEDIO_PONDERADO: {
    titulo: "Promedio Ponderado",
    subtitulo: "Weighted Average Cost",
    descripcion: "Calcula un costo promedio por cada unidad en existencia.",
    icono: faWaveSquare,
  },
};

const INFO_IMPORTANTE = {
  titulo: "Informacion Importante",
  puntos: [
    "El metodo afecta el calculo del costo de ventas y la valuacion del inventario.",
    "El cambio de metodo aplica para nuevos movimientos de inventario.",
    "Asegura aprobacion del area contable antes de guardar cambios.",
  ],
};

const tituloMetodoInventario: HeaderAdmin = {
  title: "Configuracion de Inventario",
  subTitle:
    "Define el metodo de valuacion usado para calcular el valor del inventario.",
};

export default function FifoPromConfig() {
  const navigate = useNavigate();

  const [metodoSeleccionado, setMetodoSeleccionado] =
    useState<MetodoValuacion | null>(null);
  const [notification, setNotification] = useState<NotificationStateInterface>({
    ...NotificacionData,
  });

  const {
    data: metodoResponse,
    isLoading: isLoadingMetodo,
    error: errorMetodo,
  } = useMetodoInventario();

  const {
    data: opcionesResponse,
    isLoading: isLoadingOpciones,
    error: errorOpciones,
  } = useOpcionesMetodoInventario();

  const { mutateAsync: actualizarMetodo, isPending } =
    useUpdateMetodoInventario();

  const metodoActual = metodoResponse?.data?.metodoValuacion;

  useEffect(() => {
    if (!metodoSeleccionado && metodoActual) {
      setMetodoSeleccionado(metodoActual);
    }
  }, [metodoActual, metodoSeleccionado]);

  const opciones =
    opcionesResponse?.data ??
    (["FIFO", "PROMEDIO_PONDERADO"] as MetodoValuacion[]);

  const isDirty = useMemo(() => {
    if (!metodoActual || !metodoSeleccionado) return false;
    return metodoActual !== metodoSeleccionado;
  }, [metodoActual, metodoSeleccionado]);

  const isLoading = isLoadingMetodo || isLoadingOpciones;

  const getErrorMessage = (value: unknown) => {
    if (value instanceof Error) return value.message;
    return "No se pudo cargar la configuracion del metodo de inventario.";
  };

  const goBack = () => {
    navigate("/Inventario-Management");
  };

  const onSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!metodoSeleccionado || !isDirty) {
      return;
    }

    try {
      const updated = await actualizarMetodo({
        metodoValuacion: metodoSeleccionado,
      });

      if (!updated) {
        setNotification({
          isVisible: true,
          variant: "error",
          title: "No se pudo guardar",
          message: "No fue posible actualizar el metodo de valuacion.",
        });
        return;
      }

      setNotification({
        isVisible: true,
        variant: "success",
        title: "Configuracion actualizada",
        message: "El metodo de valuacion se guardo correctamente.",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocurrio un error inesperado al guardar la configuracion.";

      const isPeriodClosedError = /periodo|periodo contable|cerrad/i.test(
        errorMessage,
      );

      setNotification({
        isVisible: true,
        variant: "error",
        title: isPeriodClosedError
          ? "Cambio bloqueado por periodos cerrados"
          : "Error al guardar",
        message: errorMessage,
      });
    }
  };

  return (
    <section className="w-full px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto w-full max-w-180">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-2 text-base font-semibold text-[#0aa6a2] transition-colors duration-300 hover:text-[#06706d]"
          onClick={goBack}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
          <span className="text-[22px] leading-none">Volver a inventario</span>
        </button>

        <HeaderTitleAdmin {...tituloMetodoInventario} />

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
          className="mt-6 rounded-2xl bg-[#f4f6f8] p-4 shadow-[0_6px_16px_rgba(0,0,0,0.1)] md:p-6"
        >
          <div className="rounded-2xl border border-[#9adce2] bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#4661b0]">
                  Metodo de Valuacion Actual
                </p>
                <p className="mt-1 text-2xl font-bold text-[#0a4d76] md:text-[28px]">
                  {metodoActual
                    ? METODO_META[metodoActual].titulo
                    : "Sin definir"}
                </p>
              </div>
              <FontAwesomeIcon
                icon={faScaleBalanced}
                className="text-3xl text-[#0aa6a2]"
              />
            </div>
            {metodoActual && (
              <p className="mt-2 text-sm text-[#4661b0]">
                {METODO_META[metodoActual].descripcion}
              </p>
            )}
          </div>

          <InfImportante {...INFO_IMPORTANTE} />

          <div className="mt-6">
            <h3 className="text-2xl font-bold text-[#0a4d76]">
              Seleccionar Metodo de Valuacion
            </h3>

            {isLoading && (
              <p className="mt-4 rounded-xl bg-[#e8f3f5] px-4 py-2 text-sm text-[#4661b0]">
                Cargando configuracion...
              </p>
            )}

            {!isLoading && (errorMetodo || errorOpciones) && (
              <p className="mt-4 rounded-xl bg-[#fdeeee] px-4 py-2 text-sm text-[#8f1e1e]">
                {getErrorMessage(errorMetodo ?? errorOpciones)}
              </p>
            )}

            {!isLoading && !errorMetodo && !errorOpciones && (
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {opciones.map((metodo) => {
                  const isSelected = metodoSeleccionado === metodo;
                  const isActual = metodoActual === metodo;
                  const meta = METODO_META[metodo];

                  return (
                    <button
                      key={metodo}
                      type="button"
                      onClick={() => setMetodoSeleccionado(metodo)}
                      className={`relative cursor-pointer rounded-2xl border-2 p-4 text-left transition-colors duration-300 ${
                        isSelected
                          ? "border-[#0aa6a2] bg-[#e8f3f5]"
                          : "border-[#9adce2] bg-white hover:bg-[#edf8fa]"
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#0aa6a2] text-white">
                          <FontAwesomeIcon icon={faCheck} className="text-sm" />
                        </span>
                      )}

                      {isActual && (
                        <span className="mb-2 inline-flex items-center rounded-full bg-[#d8f1df] px-2 py-1 text-xs font-semibold text-[#1f6b2f]">
                          Actual
                        </span>
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xl font-bold text-[#0a4d76] md:text-2xl">
                            {meta.titulo}
                          </p>
                          <p className="text-sm font-semibold text-[#4661b0]">
                            {meta.subtitulo}
                          </p>
                        </div>
                        <FontAwesomeIcon
                          icon={meta.icono}
                          className="text-2xl text-[#4661b0]"
                        />
                      </div>
                      <p className="mt-3 text-sm text-[#4661b0]">
                        {meta.descripcion}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {isDirty && metodoActual && metodoSeleccionado && (
            <div className="mt-5 rounded-xl border-l-4 border-[#f4b400] bg-[#fff8e6] px-4 py-3">
              <div className="flex items-start gap-3">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="pt-0.5 text-sm text-[#b45309]"
                />
                <div>
                  <p className="text-sm font-bold text-[#9a3412]">
                    Advertencia de Cambio
                  </p>
                  <p className="mt-1 text-sm text-[#b45309]">
                    Estas a punto de cambiar el metodo de valuacion de{" "}
                    <span className="font-semibold">
                      {METODO_META[metodoActual].titulo}
                    </span>{" "}
                    a{" "}
                    <span className="font-semibold">
                      {METODO_META[metodoSeleccionado].titulo}
                    </span>{". "}
                    Este cambio afectara los calculos futuros de inventario y
                    costo de ventas.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            <ButtonsComponet
              typeButton="button"
              onClick={goBack}
              disabled={isPending}
              className="h-11 cursor-pointer rounded-2xl border-2 border-[#9adce2] bg-white text-lg font-semibold text-[#4661b0] transition-colors duration-300 hover:bg-[#edf8fa] disabled:cursor-not-allowed disabled:opacity-70"
              text="Cancelar Cambios"
              icon=""
            />

            <ButtonsComponet
              typeButton="submit"
              onClick={() => null}
              disabled={
                isPending ||
                !isDirty ||
                !!errorMetodo ||
                !!errorOpciones ||
                !metodoSeleccionado
              }
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl text-lg font-bold text-white transition-all duration-300 disabled:cursor-not-allowed ${
                isPending ||
                !isDirty ||
                !!errorMetodo ||
                !!errorOpciones ||
                !metodoSeleccionado
                  ? "bg-[#c3c8d1]"
                  : "cursor-pointer bg-linear-to-r from-[#0aa6a2] to-[#4661b0] hover:from-[#06706d] hover:to-[#334c8b]"
              }`}
              text={isPending ? "Guardando..." : "Guardar Cambios"}
              icon="fa-solid fa-floppy-disk"
            />
          </div>
        </form>
      </div>
    </section>
  );
}
