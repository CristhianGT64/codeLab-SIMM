import { useMemo, useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";
import useListTiposCliente from "../../../hooks/TiposDeClientesHooks/useListTiposCliente";
import useCreateTipoCliente from "../../../hooks/TiposDeClientesHooks/useCreateTipoCliente";
import useUpdateTipoCliente from "../../../hooks/TiposDeClientesHooks/useUpdateTipoCliente";
import type { TipoCliente } from "../../../interfaces/TiposdeCliente/TipoClienteInterface";

interface TipoClienteFormState {
  nombre: string;
  descripcion: string;
  condicionPago: string;
  diasCredito: number;
  disponible: boolean;
}

const initialForm: TipoClienteFormState = {
  nombre: "",
  descripcion: "",
  condicionPago: "",
  diasCredito: 0,
  disponible: true,
};

export default function FormTipoCliente() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const { data: existingData, isLoading } = useListTiposCliente();
  const existingTipo = useMemo(
    () =>
      isEditMode && id
        ? existingData?.data.find((t) => t.id.toString() === id) ?? null
        : null,
    [existingData?.data, id, isEditMode],
  );

  const baseForm = useMemo<TipoClienteFormState>(() => {
    if (!existingTipo) return initialForm;
    return {
      nombre: existingTipo.nombre,
      descripcion: existingTipo.descripcion ?? "",
      condicionPago: existingTipo.condicionPago ?? "",
      diasCredito: existingTipo.diasCredito ?? 0,
      disponible: existingTipo.disponible,
    };
  }, [existingTipo]);

  const [draftForm, setDraftForm] = useState<TipoClienteFormState | null>(null);
  const form = draftForm ?? baseForm;

  const onChangeField =
    (field: keyof TipoClienteFormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value =
        field === "diasCredito"
          ? Number(e.target.value)
          : field === "disponible"
            ? e.target.value === "true"
            : e.target.value;
      setDraftForm({ ...form, [field]: value });
    };

  const createMutation = useCreateTipoCliente();
  const updateMutation = useUpdateTipoCliente();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error || updateMutation.error;

  const goBack = () => navigate("/Clients-Management?tab=tipos");

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (isEditMode && id) {
      const payload: TipoCliente = {
        id,
        nombre: form.nombre,
        descripcion: form.descripcion || null,
        condicionPago: form.condicionPago || null,
        diasCredito: form.diasCredito,
        disponible: form.disponible,
        fechaCreacion: existingTipo?.fechaCreacion ?? "",
      };
      updateMutation.mutate(payload, { onSuccess: goBack });
    } else {
      createMutation.mutate(
        {
          nombre: form.nombre,
          descripcion: form.descripcion || null,
          condicionPago: form.condicionPago || null,
          diasCredito: form.diasCredito,
        },
        { onSuccess: goBack },
      );
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

        <header className="mt-6">
          <h2 className="text-4xl font-bold text-[#0a4d76]">
            {isEditMode ? "Editar tipo de cliente" : "Nuevo tipo de cliente"}
          </h2>
          <p className="mt-2 text-2xl text-[#4661b0]">
            {isEditMode
              ? "Modifica los datos del tipo de cliente seleccionado"
              : "Completa el formulario para crear un nuevo tipo de cliente"}
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-2xl bg-[#f4f6f8] p-6 shadow-[0_6px_16px_rgba(0,0,0,0.1)] md:p-8"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Nombre del tipo de cliente{" "}
                <span className="text-[#ff4f4f]">*</span>
              </p>
              <input
                id="nombre"
                type="text"
                value={form.nombre}
                onChange={onChangeField("nombre")}
                placeholder="Ej: Mayorista"
                required
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            <div className="md:col-span-2">
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Descripción
              </p>
              <textarea
                id="descripcion"
                value={form.descripcion}
                onChange={onChangeField("descripcion")}
                placeholder="Descripción del tipo de cliente"
                rows={3}
                className="w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 py-3 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Condición de pago
              </p>
              <input
                id="condicionPago"
                type="text"
                value={form.condicionPago}
                onChange={onChangeField("condicionPago")}
                placeholder="Ej: 30 días crédito"
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Días de Crédito
              </p>
              <input
                id="diasCredito"
                type="number"
                value={form.diasCredito}
                onChange={onChangeField("diasCredito")}
                min={0}
                max={365}
                placeholder="0"
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
              <p className="mt-1 text-sm text-[#97a0b7]">
                Número de días para pago diferido (0-365)
              </p>
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Estado <span className="text-[#ff4f4f]">*</span>
              </p>
              <select
                id="disponible"
                value={form.disponible.toString()}
                onChange={onChangeField("disponible")}
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl outline-none focus:border-[#0aa6a2]"
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <ButtonsComponet
              typeButton="button"
              onClick={goBack}
              disabled={isPending}
              className="h-14 cursor-pointer rounded-2xl border-2 border-[#9adce2] bg-white text-2xl font-semibold text-[#4661b0] hover:bg-[#edf8fa]"
              text="Cancelar"
              icon="fa-solid fa-arrow-left"
            />

            {isEditMode ? (
              <ButtonsComponet
                typeButton="submit"
                onClick={() => null}
                disabled={isPending}
                className="inline-flex h-14 cursor-pointer items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-2xl font-bold text-white hover:from-[#06706d] hover:to-[#334c8b] disabled:cursor-not-allowed disabled:opacity-70"
                text={isPending ? "Actualizando..." : "Actualizar tipo"}
                icon="fa-solid fa-floppy-disk"
              />
            ) : (
              <ButtonsComponet
                typeButton="submit"
                onClick={() => null}
                disabled={isPending}
                className="inline-flex h-14 cursor-pointer items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-2xl font-bold text-white hover:from-[#06706d] hover:to-[#334c8b] disabled:cursor-not-allowed disabled:opacity-70"
                text={isPending ? "Creando..." : "Crear tipo"}
                icon="fa-solid fa-floppy-disk"
              />
            )}
          </div>

          {isEditMode && isLoading && (
            <p className="mt-4 text-base font-semibold text-[#4661b0]">
              Cargando información del tipo de cliente...
            </p>
          )}

          {mutationError && (
            <p className="mt-4 text-base font-semibold text-[#c20000]">
              {mutationError.message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
