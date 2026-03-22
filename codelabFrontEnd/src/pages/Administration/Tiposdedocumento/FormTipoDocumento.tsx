import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useNavigate, useParams } from "react-router";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";
import StatusNotification from "../../../components/notifications/StatusNotification";
import {
  NotificacionData,
  type NotificationStateInterface,
} from "../../../interfaces/NotificacionesInterface";
import {
  tipoDocumentoFormEmpty,
  type TipoDocumentoForm,
} from "../../../interfaces/TipodedocumentoInterface/TipoDocumentoInterface";
import useGetTipoDocumento from "../../../hooks/TiposDocumentoHooks/useGetTipoDocumento";
import useCreateTipoDocumento from "../../../hooks/TiposDocumentoHooks/useCreateTipoDocumento";
import useUpdateTipoDocumento from "../../../hooks/TiposDocumentoHooks/useUpdateTipoDocumento";

export default function FormTipoDocumento() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState<TipoDocumentoForm>(tipoDocumentoFormEmpty);
  const [notification, setNotification] =
    useState<NotificationStateInterface>(NotificacionData);

  const {
    data: tipoDocumentoData,
    isLoading: isLoadingTipoDocumento,
    isError: isErrorTipoDocumento,
  } = useGetTipoDocumento(id ?? "");
  const { mutateAsync: createTipoDocumento, isPending: isCreating } =
    useCreateTipoDocumento();
  const { mutateAsync: updateTipoDocumento, isPending: isUpdating } =
    useUpdateTipoDocumento();

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    if (!tipoDocumentoData?.data) {
      return;
    }

    const tipo = tipoDocumentoData.data;
    setForm({
      codigo: tipo.codigo,
      nombre: tipo.nombre,
      descripcion: tipo.descripcion,
      prefijoNumeracion: tipo.prefijoNumeracion,
      requiereCai: tipo.requiereCai,
      activo: tipo.activo,
    });
  }, [isEditMode, tipoDocumentoData]);

  const onChangeField =
    (field: keyof TipoDocumentoForm) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const value =
        field === "requiereCai"
          ? (event.target as HTMLInputElement).checked
          : field === "activo"
            ? event.target.value === "true"
            : event.target.value;

      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const onSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (isEditMode && id) {
        await updateTipoDocumento({
          id,
          body: form,
        });

        setNotification({
          isVisible: true,
          variant: "success",
          title: "Tipo de documento actualizado",
          message: "Los cambios se guardaron correctamente.",
        });

        globalThis.setTimeout(() => {
          navigate("/Tipos-Documento-Management");
        }, 1200);

        return;
      }

      await createTipoDocumento(form);

      setNotification({
        isVisible: true,
        variant: "success",
        title: "Tipo de documento creado",
        message: "El tipo de documento se registro correctamente.",
      });

      globalThis.setTimeout(() => {
        navigate("/Tipos-Documento-Management");
      }, 1200);
    } catch {
      setNotification({
        isVisible: true,
        variant: "error",
        title: "No se pudo guardar",
        message: "Verifica los datos e intenta nuevamente.",
      });
    }
  };

  return (
    <section className="w-full px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-220">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-2 text-base font-semibold text-[#0aa6a2] hover:text-[#06706d]"
          onClick={() => {
            navigate("/Tipos-Documento-Management");
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
          <span className="text-[32px] leading-none">Volver al listado</span>
        </button>

        <header className="mt-6">
          <h2 className="text-4xl font-bold text-[#0a4d76]">
            {isEditMode ? "Editar Tipo de Documento" : "Nuevo Tipo de Documento"}
          </h2>
          <p className="mt-2 text-2xl text-[#4661b0]">
            {isEditMode
              ? "Actualiza la configuracion del tipo de documento"
              : "Registra un nuevo tipo de documento para facturacion"}
          </p>
        </header>

        <form
          className="mt-8 rounded-2xl bg-[#f4f6f8] p-6 shadow-[0_6px_16px_rgba(0,0,0,0.1)] md:p-8"
          onSubmit={onSubmit}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Código <span className="text-[#ff4f4f]">*</span>
              </p>
              <input
                id="codigo"
                type="text"
                value={form.codigo}
                onChange={onChangeField("codigo")}
                placeholder="FC"
                required
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Prefijo de numeración <span className="text-[#ff4f4f]">*</span>
              </p>
              <input
                id="prefijoNumeracion"
                type="text"
                value={form.prefijoNumeracion}
                onChange={onChangeField("prefijoNumeracion")}
                placeholder="FC-"
                required
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
              <p className="mt-1 text-sm text-[#6a758f]">Ejemplo: FC-00001, FR-00001</p>
            </div>

            <div className="md:col-span-2">
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Nombre del documento <span className="text-[#ff4f4f]">*</span>
              </p>
              <input
                id="nombre"
                type="text"
                value={form.nombre}
                onChange={onChangeField("nombre")}
                placeholder="Factura de Contado"
                required
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            <div className="md:col-span-2">
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">Descripción</p>
              <textarea
                id="descripcion"
                rows={4}
                value={form.descripcion}
                onChange={onChangeField("descripcion")}
                placeholder="Descripcion del tipo de documento..."
                className="w-full resize-none rounded-2xl border-2 border-[#9adce2] bg-white px-5 py-4 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            <div className="md:col-span-2 rounded-2xl border-2 border-[#f4d56a] bg-[#fff8e4] p-5">
              <label className="flex cursor-pointer items-start gap-3 text-xl font-semibold text-[#0a4d76]">
                <input
                  id="requiereCai"
                  type="checkbox"
                  checked={form.requiereCai}
                  onChange={onChangeField("requiereCai")}
                  className="mt-1 h-5 w-5 accent-[#0aa6a2]"
                />
                <span>Requiere CAI (Código de autorización de impresión)</span>
              </label>
              <p className="mt-2 pl-8 text-lg text-[#4661b0]">
                Los documentos que requieren CAI necesitan autorización fiscal.
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Estado <span className="text-[#ff4f4f]">*</span>
              </p>
              <select
                id="activo"
                value={form.activo.toString()}
                onChange={onChangeField("activo")}
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl outline-none focus:border-[#0aa6a2]"
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>

          {isEditMode && isLoadingTipoDocumento && (
            <p className="mt-4 text-base font-semibold text-[#4661b0]">
              Cargando informacion del tipo de documento...
            </p>
          )}

          {isEditMode && isErrorTipoDocumento && (
            <p className="mt-4 text-base font-semibold text-[#c20000]">
              No se pudo cargar el detalle del tipo de documento.
            </p>
          )}

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <ButtonsComponet
              text="Cancelar"
              typeButton="button"
              className="h-14 cursor-pointer rounded-2xl border-2 border-[#9adce2] bg-white text-2xl font-semibold text-[#4661b0] hover:bg-[#edf8fa]"
              icon=""
              onClick={() => {
                navigate("/Tipos-Documento-Management");
              }}
              disabled={isPending}
            />

            <ButtonsComponet
              text={
                isPending
                  ? isEditMode
                    ? "Actualizando..."
                    : "Creando..."
                  : isEditMode
                    ? "Actualizar Tipo de Documento"
                    : "Crear Tipo de Documento"
              }
              typeButton="submit"
              className="inline-flex h-14 cursor-pointer items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-2xl font-bold text-white hover:from-[#06706d] hover:to-[#334c8b] disabled:cursor-not-allowed disabled:opacity-70"
              icon={isPending ? "" : "fa-solid fa-check"}
              onClick={() => null}
              disabled={isPending}
            />
          </div>
        </form>
      </div>

      <StatusNotification
        {...notification}
        onClose={() => setNotification((prev) => ({ ...prev, isVisible: false }))}
      />
    </section>
  );
}