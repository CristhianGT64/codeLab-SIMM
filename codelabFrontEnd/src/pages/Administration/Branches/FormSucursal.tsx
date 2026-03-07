import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import ButtonsComponet from '../../../components/buttonsComponents/ButtonsComponet';
import useListSucursales from '../../../hooks/SucursalesHooks/useListSucursales';
import useCreateSucursal from '../../../hooks/SucursalesHooks/useCreateSucursal';
import useUpdateSucursal from '../../../hooks/SucursalesHooks/useUpdateSucursal';

interface SucursalFormState {
  nombre: string;
  direccion: string;
  gerente: string;
  telefono: string;
  activa: boolean;
}

const initialSucursalForm: SucursalFormState = {
  nombre: '',
  direccion: '',
  gerente: '',
  telefono: '',
  activa: true,
};

export default function FormSucursal() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState<SucursalFormState>(initialSucursalForm);

  const { data: existingData, isLoading } = useListSucursales();
  
  const {
    mutateAsync: createSucursal,
    isPending: creating,
    error: createError,
  } = useCreateSucursal();
  const {
    mutateAsync: updateSucursal,
    isPending: updating,
    error: updateError,
  } = useUpdateSucursal();

  const isPending = creating || updating;
  const mutationError = createError ?? updateError;

  useEffect(() => {
    if (isEditMode && id && existingData) {
      // los IDs vienen como número en los datos y como string en la URL;
      // convertimos al mismo tipo para evitar comparación fallida.
      const found = existingData.data.find(
        (s: any) => s.id.toString() === id,
      );
      if (found) {
        setForm({
          nombre: found.nombre,
          direccion: found.direccion,
          gerente: found.gerente,
          telefono: found.telefono || '',
          activa: found.activa,
        });
      }
    }
  }, [isEditMode, id, existingData]);

  const goBack = () => {
    navigate('/Branches-Management');
  };

  const onChangeField =
    (field: keyof SucursalFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        field === 'activa'
          ? event.target.value === 'true'
          : event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const onSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const processed = isEditMode && id
        ? await updateSucursal({ id, ...form })
        : await createSucursal(form);

      if (processed) {
        navigate('/Branches-Management');
      }
    } catch {}
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
            {isEditMode ? 'Editar sucursal' : 'Nueva sucursal'}
          </h2>
          <p className="mt-2 text-2xl text-[#4661b0]">
            {isEditMode
              ? 'Modifica los datos de la sucursal seleccionada'
              : 'Completa el formulario para crear una nueva sucursal'}
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-2xl bg-[#f4f6f8] p-6 shadow-[0_6px_16px_rgba(0,0,0,0.1)] md:p-8"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Nombre de la sucursal <span className="text-[#ff4f4f]">*</span>
              </p>
              <input
                id="nombre"
                type="text"
                value={form.nombre}
                onChange={onChangeField('nombre')}
                placeholder="Ej: Sucursal Central"
                required
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            <div className="md:col-span-2">
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Dirección completa <span className="text-[#ff4f4f]">*</span>
              </p>
              <input
                id="direccion"
                type="text"
                value={form.direccion}
                onChange={onChangeField('direccion')}
                required
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Nombre del gerente <span className="text-[#ff4f4f]">*</span>
              </p>
              <input
                id="gerente"
                type="text"
                value={form.gerente}
                onChange={onChangeField('gerente')}
                required
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Teléfono
              </p>
              <input
                id="telefono"
                type="text"
                value={form.telefono}
                onChange={onChangeField('telefono')}
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            <div className="md:col-span-2">
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Estado <span className="text-[#ff4f4f]">*</span>
              </p>
              <select
                id="activa"
                value={form.activa.toString()}
                onChange={onChangeField('activa')}
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl outline-none focus:border-[#0aa6a2]"
              >
                <option value="true">Activa</option>
                <option value="false">Inactiva</option>
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
                text={isPending ? "Actualizando..." : "Actualizar sucursal"}
                icon="fa-solid fa-floppy-disk"
              />
            ) : (
              <ButtonsComponet
                typeButton="submit"
                onClick={() => null}
                disabled={isPending}
                className="inline-flex h-14 cursor-pointer items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-2xl font-bold text-white hover:from-[#06706d] hover:to-[#334c8b] disabled:cursor-not-allowed disabled:opacity-70"
                text={isPending ? "Creando..." : "Crear Sucursal"}
                icon="fa-solid fa-floppy-disk"
              />
            )}
          </div>

          {isEditMode && isLoading && (
            <p className="mt-4 text-base font-semibold text-[#4661b0]">
              Cargando información de la sucursal...
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
