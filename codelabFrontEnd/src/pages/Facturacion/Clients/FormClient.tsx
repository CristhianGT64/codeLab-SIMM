import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ButtonsComponet from '../../../components/buttonsComponents/ButtonsComponet';
import { useCreateClient } from '../../../hooks/ClientesHooks/useCreateClient';
import { useUpdateClient } from '../../../hooks/ClientesHooks/useUpdateClient';
import { useClientDetail } from '../../../hooks/ClientesHooks/useClientDetail';
import useListTiposCliente from '../../../hooks/TiposDeClientesHooks/useListTiposCliente';
import type { CreateClientPayload } from '../../../interfaces/Clients/ClientInterface';

const FormClient = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { data: clientDetail, isLoading: loadingClient } = useClientDetail(id);
  const { data: tiposResponse } = useListTiposCliente();
  const tiposDisponibles = useMemo(
    () => (tiposResponse?.data ?? []).filter((t) => t.disponible),
    [tiposResponse],
  );
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const [draftForm, setDraftForm] = useState<CreateClientPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const defaultTipo = tiposDisponibles[0];

  const baseForm = useMemo<CreateClientPayload>(() => {
    if (!clientDetail) {
      return {
        nombreCompleto: '',
        identificacion: '',
        telefono: '',
        correo: '',
        direccion: '',
        tipoClienteId: defaultTipo?.id ?? '',
        tipoCliente: defaultTipo?.nombre ?? '',
      };
    }

    return {
      nombreCompleto: clientDetail.nombreCompleto,
      identificacion: clientDetail.identificacion,
      telefono: clientDetail.telefono,
      correo: clientDetail.correo,
      direccion: clientDetail.direccion,
      tipoClienteId: clientDetail.tipoClienteId,
      tipoCliente: clientDetail.tipoCliente,
    };
  }, [clientDetail, defaultTipo]);
  const form = draftForm ?? baseForm;

  const isSaving = createClient.status === 'pending' || updateClient.status === 'pending';

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.nombreCompleto.trim() || !form.identificacion.trim() || !form.telefono.trim() || !form.correo.trim() || !form.direccion.trim()) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }
    if (!form.identificacion.trim()) {
      setError('La identificación (DNI) es obligatoria.');
      return;
    }

    try {
      const payload: CreateClientPayload = {
        ...form,
      };

      if (isEdit && id) {
        await updateClient.mutateAsync({ id, payload });
      } else {
        await createClient.mutateAsync(payload);
      }
      navigate('/Clients-Management');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al guardar el cliente. Intenta nuevamente.';
      console.error('Error guardando cliente', err);
      setError(message);
    }
  };


  return (
    <section className="w-full px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-220">
        <button
          type="button"
          onClick={() => navigate('/Clients-Management')}
          className="inline-flex cursor-pointer items-center gap-2 text-base font-semibold text-[#0aa6a2] hover:text-[#06706d]"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
          <span className="text-[32px] leading-none">Volver al listado</span>
        </button>

        <header className="mt-6">
          <h2 className="text-4xl font-bold text-[#0a4d76]">{isEdit ? 'Editar cliente' : 'Nuevo cliente'}</h2>
          <p className="mt-2 text-2xl text-[#4661b0]">
            {isEdit ? 'Modifica los datos del cliente seleccionado' : 'Completa el formulario para crear un nuevo cliente'}
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-2xl bg-[#f4f6f8] p-6 shadow-[0_6px_16px_rgba(0,0,0,0.1)] md:p-8"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">Nombre completo <span className="text-[#ff4f4f]">*</span></p>
              <input
                type="text"
                value={form.nombreCompleto}
                onChange={(e) => setDraftForm((prev) => ({ ...(prev ?? form), nombreCompleto: e.target.value }))}
                placeholder="Ej: María García López"
                required
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            <div className="md:col-span-2">
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">Identificación (DNI) <span className="text-[#ff4f4f]">*</span></p>
              <input
                type="text"
                value={form.identificacion}
                onChange={(e) => setDraftForm((prev) => ({ ...(prev ?? form), identificacion: e.target.value }))}
                placeholder="Ej: 12345678A"
                required
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">Teléfono <span className="text-[#ff4f4f]">*</span></p>
              <input
                type="text"
                value={form.telefono}
                onChange={(e) => setDraftForm((prev) => ({ ...(prev ?? form), telefono: e.target.value }))}
                required
                placeholder="Ej: +34 612 345 678"
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">Correo electrónico <span className="text-[#ff4f4f]">*</span></p>
              <input
                type="email"
                value={form.correo}
                onChange={(e) => setDraftForm((prev) => ({ ...(prev ?? form), correo: e.target.value }))}
                required
                placeholder="Ej: cliente@email.com"
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            <div className="md:col-span-2">
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">Dirección <span className="text-[#ff4f4f]">*</span></p>
              <input
                type="text"
                value={form.direccion}
                onChange={(e) => setDraftForm((prev) => ({ ...(prev ?? form), direccion: e.target.value }))}
                required
                placeholder="Ej: Calle Mayor 123, Madrid"
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">Tipo de cliente <span className="text-[#ff4f4f]">*</span></p>
              <select
                value={form.tipoClienteId}
                onChange={(e) => {
                  const selected = tiposDisponibles.find((t) => t.id === e.target.value);
                  if (selected) {
                    setDraftForm((prev) => ({ ...(prev ?? form), tipoCliente: selected.nombre, tipoClienteId: selected.id }));
                  }
                }}
                required
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl outline-none focus:border-[#0aa6a2]"
              >
                {tiposDisponibles.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {(loadingClient || isSaving) && (
            <p className="mt-4 text-base font-semibold text-[#4661b0]">Cargando información...</p>
          )}

          {error && (
            <p className="mt-4 text-base font-semibold text-[#c20000]">{error}</p>
          )}

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <ButtonsComponet
              typeButton="button"
              onClick={() => navigate('/Clients-Management')}
              disabled={isSaving}
              className="h-14 cursor-pointer rounded-2xl border-2 border-[#9adce2] bg-white text-2xl font-semibold text-[#4661b0] hover:bg-[#edf8fa]"
              text="Cancelar"
              icon="fa-solid fa-arrow-left"
            />
            <ButtonsComponet
              typeButton="submit"
              onClick={() => null}
              disabled={isSaving}
              className="inline-flex h-14 cursor-pointer items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-2xl font-bold text-white hover:from-[#06706d] hover:to-[#334c8b] disabled:cursor-not-allowed disabled:opacity-70"
              text={isSaving ? (isEdit ? 'Actualizando...' : 'Creando...') : (isEdit ? 'Actualizar cliente' : 'Crear cliente')}
              icon="fa-solid fa-floppy-disk"
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default FormClient;
