import {
  useMemo,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { useNavigate, useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPercent } from "@fortawesome/free-solid-svg-icons";
import ButtonsComponet from "../../../../components/buttonsComponents/ButtonsComponet";
import HeaderTitleAdmin from "../../../../components/headers/HeaderAdmin";
import InfImportante from "../../../../components/informacionImportante/InfImportante";
import StatusNotification from "../../../../components/notifications/StatusNotification";
import {
  HeaderEditarImpuesto,
  HeaderNuevoImpuesto,
  InformacionImportanteImpuestos,
} from "../../../../data/dataAdministrator/ImpuestosData";
import useCreateImpuesto from "../../../../hooks/ConfiguracionHooks/useCreateImpuesto";
import useListImpuestos from "../../../../hooks/ConfiguracionHooks/useListImpuestos";
import useUpdateImpuesto from "../../../../hooks/ConfiguracionHooks/useUpdateImpuesto";
import {
  NotificacionData,
  type NotificationStateInterface,
} from "../../../../interfaces/NotificacionesInterface";

interface ImpuestoFormState {
  nombre: string;
  porcentaje: string;
}

const INITIAL_FORM: ImpuestoFormState = {
  nombre: "",
  porcentaje: "",
};

export default function FormImpuesto() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [notification, setNotification] = useState<NotificationStateInterface>({
    ...NotificacionData,
  });
  const [draftForm, setDraftForm] = useState<ImpuestoFormState | null>(null);

  const { data: impuestosData, isLoading } = useListImpuestos();
  const createMutation = useCreateImpuesto();
  const updateMutation = useUpdateImpuesto();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const impuestoActual = useMemo(() => {
    if (!isEditMode || !id) {
      return null;
    }

    return impuestosData?.data.find((impuesto) => impuesto.id === id) ?? null;
  }, [id, impuestosData?.data, isEditMode]);

  const baseForm = useMemo<ImpuestoFormState>(() => {
    if (!impuestoActual) {
      return INITIAL_FORM;
    }

    return {
      nombre: impuestoActual.nombre,
      porcentaje: impuestoActual.porcentaje.toString(),
    };
  }, [impuestoActual]);

  const form = draftForm ?? baseForm;
  const porcentaje = Number(form.porcentaje);
  const porcentajeValido = Number.isFinite(porcentaje) ? porcentaje : 0;
  const tasaDecimal = Number((porcentajeValido / 100).toFixed(4));

  const goBack = () => {
    navigate("/Configuracion/Impuestos");
  };

  const onChangeField =
    (field: keyof ImpuestoFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setDraftForm((prev) => ({
        ...(prev ?? form),
        [field]: event.target.value,
      }));
    };

  const onSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.nombre.trim()) {
      setNotification({
        isVisible: true,
        variant: "error",
        title: "Nombre requerido",
        message: "Debes ingresar el nombre del impuesto.",
      });
      return;
    }

    if (!Number.isFinite(porcentaje) || porcentaje <= 0 || porcentaje > 100) {
      setNotification({
        isVisible: true,
        variant: "error",
        title: "Porcentaje invalido",
        message: "Ingresa un porcentaje mayor a 0 y menor o igual a 100.",
      });
      return;
    }

    try {
      if (isEditMode && id) {
        await updateMutation.mutateAsync({
          id,
          nombre: form.nombre.trim(),
          porcentaje,
        });

        setNotification({
          isVisible: true,
          variant: "success",
          title: "Impuesto actualizado",
          message: "Los cambios del impuesto se guardaron correctamente.",
        });
      } else {
        await createMutation.mutateAsync({
          nombre: form.nombre.trim(),
          porcentaje,
        });

        setNotification({
          isVisible: true,
          variant: "success",
          title: "Impuesto creado",
          message: "El impuesto se registro correctamente.",
        });
      }

      globalThis.setTimeout(() => {
        navigate("/Configuracion/Impuestos");
      }, 1300);
    } catch (error) {
      setNotification({
        isVisible: true,
        variant: "error",
        title: isEditMode ? "No se pudo actualizar" : "No se pudo crear",
        message:
          error instanceof Error
            ? error.message
            : "Ocurrio un error inesperado al guardar el impuesto.",
      });
    }
  };

  return (
    <section className="w-full px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-220">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex cursor-pointer items-center gap-2 text-base font-semibold text-[#0aa6a2] hover:text-[#06706d]"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
          <span className="text-[32px] leading-none">Volver al listado</span>
        </button>

        <HeaderTitleAdmin
          {...(isEditMode ? HeaderEditarImpuesto : HeaderNuevoImpuesto)}
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Nombre del impuesto <span className="text-[#ff4f4f]">*</span>
              </p>
              <input
                id="nombre"
                type="text"
                value={form.nombre}
                onChange={onChangeField("nombre")}
                placeholder="Ej: ISV 15%"
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
                required
              />
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Porcentaje <span className="text-[#ff4f4f]">*</span>
              </p>
              <div className="relative">
                <span className="absolute top-1/2 left-5 -translate-y-1/2 text-xl font-semibold text-[#6a758f]">
                  <FontAwesomeIcon icon={faPercent} />
                </span>
                <input
                  id="porcentaje"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="100"
                  value={form.porcentaje}
                  onChange={onChangeField("porcentaje")}
                  placeholder="15"
                  className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white pl-14 pr-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
                  required
                />
              </div>
              <p className="mt-1 text-sm text-[#97a0b7]">
                Ingresa el valor porcentual tradicional, por ejemplo 15 o 18.
              </p>
            </div>

            <div className="rounded-2xl border border-[#9adce2] bg-white p-5">
              <p className="text-sm font-semibold text-[#4661b0]">
                Vista previa de la tasa
              </p>
              <p className="mt-2 text-3xl font-bold text-[#0a4d76]">
                {tasaDecimal.toFixed(4)}
              </p>
              <p className="mt-2 text-sm text-[#4661b0]">
                Esta es la tasa decimal equivalente que usaran productos y
                calculos de venta.
              </p>
            </div>
          </div>

          <InfImportante {...InformacionImportanteImpuestos} />

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <ButtonsComponet
              typeButton="button"
              onClick={goBack}
              disabled={isPending}
              className="h-14 cursor-pointer rounded-2xl border-2 border-[#9adce2] bg-white text-2xl font-semibold text-[#4661b0] hover:bg-[#edf8fa]"
              text="Cancelar"
              icon="fa-solid fa-arrow-left"
            />

            <ButtonsComponet
              typeButton="submit"
              onClick={() => null}
              disabled={isPending}
              className="inline-flex h-14 cursor-pointer items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-2xl font-bold text-white hover:from-[#06706d] hover:to-[#334c8b] disabled:cursor-not-allowed disabled:opacity-70"
              text={
                isPending
                  ? isEditMode
                    ? "Actualizando..."
                    : "Creando..."
                  : isEditMode
                    ? "Actualizar impuesto"
                    : "Crear impuesto"
              }
              icon="fa-solid fa-floppy-disk"
            />
          </div>

          {isEditMode && isLoading && (
            <p className="mt-4 text-base font-semibold text-[#4661b0]">
              Cargando informacion del impuesto...
            </p>
          )}

          {isEditMode && !isLoading && !impuestoActual && (
            <p className="mt-4 text-base font-semibold text-[#c20000]">
              No se encontro el impuesto solicitado.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
