import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faUserGear } from "@fortawesome/free-solid-svg-icons";
import type { TipoCliente } from "../../interfaces/TiposdeCliente/TipoClienteInterface";
import useCreateTipoCliente from "../../hooks/TiposDeClientesHooks/useCreateTipoCliente";
import useUpdateTipoCliente from "../../hooks/TiposDeClientesHooks/useUpdateTipoCliente";
import ButtonsComponet from "../buttonsComponents/ButtonsComponet";

interface Props {
  tipoCliente: TipoCliente | null;
  onClose: () => void;
}

interface FormState {
  nombre: string;
  descripcion: string;
  condicionPago: string;
  diasCredito: number;
  disponible: boolean;
}

export default function EditTipoClienteModal({ tipoCliente, onClose }: Props) {
  const isEditMode = Boolean(tipoCliente);

  const [form, setForm] = useState<FormState>({
    nombre: tipoCliente?.nombre ?? "",
    descripcion: tipoCliente?.descripcion ?? "",
    condicionPago: tipoCliente?.condicionPago ?? "",
    diasCredito: tipoCliente?.diasCredito ?? 0,
    disponible: tipoCliente?.disponible ?? true,
  });

  const createMutation = useCreateTipoCliente();
  const updateMutation = useUpdateTipoCliente();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error || updateMutation.error;

  const onChange =
    (field: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value =
        field === "diasCredito"
          ? Number(e.target.value)
          : field === "disponible"
            ? e.target.value === "true"
            : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (isEditMode && tipoCliente) {
      updateMutation.mutate(
        {
          id: tipoCliente.id,
          nombre: form.nombre,
          descripcion: form.descripcion || null,
          condicionPago: form.condicionPago || null,
          diasCredito: form.diasCredito,
          disponible: form.disponible,
          fechaCreacion: tipoCliente.fechaCreacion,
        },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(
        {
          nombre: form.nombre,
          descripcion: form.descripcion || null,
          condicionPago: form.condicionPago || null,
          diasCredito: form.diasCredito,
        },
        { onSuccess: onClose },
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 rounded-t-2xl bg-linear-to-r from-[#0a4d76] to-[#4661b0] px-6 py-5 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <FontAwesomeIcon icon={faUserGear} className="text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold">
              {isEditMode ? "Editar Tipo de Cliente" : "Nuevo Tipo de Cliente"}
            </h3>
            <p className="text-base opacity-80">
              {isEditMode
                ? "Modifica los datos del tipo de cliente"
                : "Completa los datos para crear un nuevo tipo"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-2xl text-white/80 hover:text-white"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="m-6 rounded-2xl bg-[#f4f6f8] p-6 shadow-[0_6px_16px_rgba(0,0,0,0.1)] md:p-8"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Nombre */}
            <div className="md:col-span-2">
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Nombre del Tipo <span className="text-[#ff4f4f]">*</span>
              </p>
              <input
                type="text"
                value={form.nombre}
                onChange={onChange("nombre")}
                placeholder="Ej: Minorista"
                required
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Descripción <span className="text-[#ff4f4f]">*</span>
              </p>
              <textarea
                value={form.descripcion}
                onChange={onChange("descripcion")}
                placeholder="Descripción del tipo de cliente"
                rows={3}
                required
                className="w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 py-4 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            {/* Condición de Pago */}
            <div className="md:col-span-2">
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Condición de Pago <span className="text-[#ff4f4f]">*</span>
              </p>
              <input
                type="text"
                value={form.condicionPago}
                onChange={onChange("condicionPago")}
                placeholder="Ej: Contado - Pago inmediato"
                required
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            {/* Días de Crédito */}
            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Días de Crédito
              </p>
              <input
                type="number"
                value={form.diasCredito}
                onChange={onChange("diasCredito")}
                min={0}
                max={365}
                placeholder="0"
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
              <p className="mt-1 text-sm text-[#97a0b7]">
                Número de días para pago diferido (0-365)
              </p>
            </div>

            {/* Estado */}
            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Estado
              </p>
              <div className="flex h-14 items-center gap-6 rounded-2xl border-2 border-[#9adce2] bg-white px-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="disponible"
                    value="true"
                    checked={form.disponible}
                    onChange={onChange("disponible")}
                    className="accent-[#0aa6a2] w-5 h-5"
                  />
                  <span className="text-lg font-semibold text-green-700">Activo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="disponible"
                    value="false"
                    checked={!form.disponible}
                    onChange={onChange("disponible")}
                    className="accent-red-500 w-5 h-5"
                  />
                  <span className="text-lg font-semibold text-red-700">Inactivo</span>
                </label>
              </div>
            </div>
          </div>

          {mutationError && (
            <p className="mt-4 text-base font-semibold text-[#c20000]">
              {mutationError.message}
            </p>
          )}

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <ButtonsComponet
              typeButton="button"
              onClick={onClose}
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
                    ? "Actualizar tipo"
                    : "Crear tipo"
              }
              icon="fa-solid fa-floppy-disk"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
