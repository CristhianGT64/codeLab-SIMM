import { useNavigate, useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendarDays, faEuroSign, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';
import { useClientDetail } from '../../../hooks/ClientesHooks/useClientDetail';
import type { Invoice } from '../../../interfaces/Clients/ClientInterface';

const statusStyles: Record<string, string> = {
  Pagada: 'bg-[#e6f9f0] text-[#0f7a3c] border border-[#b6e7d2]',
  Pendiente: 'bg-[#eaf1ff] text-[#254e9f] border border-[#b6c7e7]',
  Vencida: 'bg-[#ffe1df] text-[#bf2d2d] border border-[#f5c6be]',
};

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: client, isLoading, isError, error } = useClientDetail(id);

  if (isLoading) {
    return <p className="p-5 text-[#2f4d7f]">Cargando cliente...</p>;
  }

  if (isError) {
    return <p className="p-5 text-[#c53030]">{error instanceof Error ? error.message : 'No se pudo cargar el cliente'}</p>;
  }

  if (!client) {
    return <p className="p-5 text-[#4661b0]">Cliente no encontrado.</p>;
  }

  const formatHnl = (value: number | undefined) => {
    const formatted = new Intl.NumberFormat('es-HN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value ?? 0);

    // Mostrar los lempiras con el símbolo al final, similar al estilo de la imagen.
    return `${formatted} L`;
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((chunk) => chunk[0].toUpperCase())
      .join('');

  const initials = getInitials(client.nombreCompleto);

  return (
    <section className="w-full px-4 py-5 md:px-6 md:py-8 bg-[#f4f6f8]">
      <div className="mx-auto w-full max-w-5xl">
        <button
          type="button"
          onClick={() => navigate('/Clients-Management')}
          className="mb-6 inline-flex items-center gap-3 text-2xl font-semibold text-[#0aa6a2] hover:text-[#078985] md:text-4xl"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xl md:text-3xl" />
          Volver a la lista de clientes
        </button>

        <div className="mb-6 rounded-2xl bg-white p-6 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#0aa6a2] to-[#4661b0] text-2xl font-bold text-white">
                {initials}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-[#4b5f82]">Cliente</p>
                <h1 className="mt-1 text-3xl font-bold text-[#0b3f70]">{client.nombreCompleto}</h1>
                <p className="mt-1 text-sm text-[#475b7f]">
                  DNI: {client.identificacion} · {client.telefono || '—'} · {client.correo || '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-gradient-to-r from-[#0aa6a2] to-[#4661b0] px-4 py-2 text-sm font-bold text-white">
                {client.tipoCliente}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="relative rounded-2xl bg-white p-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)] border-l-4 border-[#0aa6a2]">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#4f6388]">Total Facturado</div>
                <div className="mt-2 text-3xl font-extrabold text-[#0d3f7f]">{formatHnl(client.totalFacturado)}</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d3f2eb] text-[#0a7363]">
                <FontAwesomeIcon icon={faFileInvoiceDollar} />
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl bg-white p-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)] border-l-4 border-[#0d5ec9]">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#4f6388]">Total Pagado</div>
                <div className="mt-2 text-3xl font-extrabold text-[#0d3f7f]">{formatHnl(client.totalPagado)}</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4f6e6] text-[#0f7a3c]">
                <FontAwesomeIcon icon={faEuroSign} />
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl bg-white p-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)] border-l-4 border-[#0b4c83]">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#4f6388]">Total Pendiente</div>
                <div className="mt-2 text-3xl font-extrabold text-[#0d3f7f]">{formatHnl(client.totalPendiente)}</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0f0] text-[#bf2d2d]">
                <FontAwesomeIcon icon={faCalendarDays} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
          <div className="rounded-t-2xl bg-gradient-to-r from-[#0aa6a2] to-[#4661b0] px-6 py-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-white">Historial de Facturación</h2>
              <p className="text-sm text-white/80">Listado de facturas del cliente</p>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#2b4a89] shadow-sm">
                {client.facturas?.length ?? 0} facturas
              </span>
            </div>

            {client.facturas?.length === 0 ? (
              <div className="rounded-lg bg-[#f8fbff] p-3 text-sm text-[#3d4f72]">No hay facturas registradas para este cliente.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-[#dbe5f5] bg-[#f3f7ff]">
                    <tr>
                      <th className="px-3 py-2 font-semibold text-[#2a4b81]">Número de Factura</th>
                      <th className="px-3 py-2 font-semibold text-[#2a4b81]">Fecha</th>
                      <th className="px-3 py-2 font-semibold text-[#2a4b81]">Total</th>
                      <th className="px-3 py-2 font-semibold text-[#2a4b81]">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {client.facturas.map((invoice: Invoice) => (
                      <tr key={invoice.id} className="border-b border-[#eef3ff] hover:bg-[#f7faff]">
                        <td className="flex items-center gap-2 px-3 py-2 text-[#1f3f70]">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#eaf1ff] text-[#254e9f]">
                            <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-sm" />
                          </div>
                          <span>{invoice.numero}</span>
                        </td>
                        <td className="flex items-center gap-2 px-3 py-2 text-[#35507d]">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#eaf1ff] text-[#254e9f]">
                            <FontAwesomeIcon icon={faCalendarDays} className="text-sm" />
                          </div>
                          <span>{invoice.fecha}</span>
                        </td>
                        <td className="px-3 py-2 text-[#1f3f70]">{formatHnl(invoice.total)}</td>
                        <td className="px-3 py-2">
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[invoice.estado] ?? 'bg-[#eaf1ff] text-[#254e9f]'}`}>
                            {invoice.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4 flex items-center justify-end gap-3 text-sm font-semibold text-[#50698f]">
              <span>Total de facturas:</span>
              <span className="text-[#0b3f70]">{client.facturas?.length ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientDetail;
