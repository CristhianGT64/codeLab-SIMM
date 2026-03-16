import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faClock, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useClients } from '../../../hooks/ClientesHooks/useClients';
import useAuth from '../../../hooks/useAuth';
import CardTotalComponent from '../../../components/cardTotalComponent/CardTotalComponent';
import type { Client } from '../../../interfaces/Clients/ClientInterface';

const typeStyles: Record<string, string> = {
  Contado: 'bg-[#f8f9fc] text-[#013f84] border border-[#d7e0f7]',
  Crédito: 'bg-[#fdf0ed] text-[#9d2710] border border-[#f5c6be]',
  Mayorista: 'bg-[#e8f8f8] text-[#0a6b7d] border border-[#bfe6e6]',
  Minorista: 'bg-[#eefaf1] text-[#0b6b2d] border border-[#cfe8d1]',
};

const ClientsManagement = () => {
  const navigate = useNavigate();
  const { data: clients, isLoading, isError, error } = useClients();
  const [term, setTerm] = useState('');
  const { tienePermiso } = useAuth();

  const list: Client[] = clients ?? [];
  const totalClients = list.length;
  const mayoristaCount = list.filter((c) => c.tipoCliente?.toLowerCase().includes('mayor')).length;
  const minoristaCount = list.filter((c) => c.tipoCliente?.toLowerCase().includes('minor')).length;

  const filteredClients = useMemo<Client[]>(() => {
    if (!term.trim()) return list;
    const lower = term.toLowerCase();
    return list.filter((client) =>
      [client.nombreCompleto, client.identificacion, client.correo]
        .join(' ')
        .toLowerCase()
        .includes(lower),
    );
  }, [list, term]);

  return (
    <section className="w-full px-4 py-5 md:px-6 bg-[#f3f5f8]">
      <header>
        <h2 className="text-3xl font-bold text-[#0b4d77] md:text-4xl">Gestión de Clientes</h2>
        <p className="mt-1 text-lg text-[#4661b0] md:text-xl">Panel administrativo</p>
      </header>

      <div className="mt-6 rounded-2xl bg-[#f3f5f8] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <label className="flex h-11 w-full items-center gap-3 rounded-xl border-2 border-[#9adce2] bg-white px-4 md:max-w-120">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-lg text-[#9adce2]" />
            <input
              type="text"
              placeholder="Buscar clientes por su nombre o DNI..."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full bg-transparent text-base text-[#6a758f] placeholder:text-[#8891a7] outline-none md:text-lg"
            />
          </label>
          {tienePermiso('Crear clientes') && (
            <button
              type="button"
              className="cursor-pointer flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] px-6 text-base font-semibold text-white hover:from-[#034d4a] hover:to-[#2c3d70]"
              onClick={() => navigate('/Clients-Management/Create-Client')}
            >
              + Nuevo Cliente
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <CardTotalComponent title="Total de clientes" total={totalClients} colorNumber="text-[#0a4d76]" />
        <CardTotalComponent title="Clientes mayoristas" total={mayoristaCount} colorNumber="text-[#0a6b7d]" />
        <CardTotalComponent title="Clientes minoristas" total={minoristaCount} colorNumber="text-[#0b6b2d]" />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-left text-white">
              <th className="px-6 py-4 text-base font-semibold md:text-lg">Nombre / Correo electrónico</th>
              <th className="px-4 py-4 text-base font-semibold md:text-lg">Identificación (DNI)</th>
              <th className="px-4 py-4 text-base font-semibold md:text-lg">Teléfono</th>
              <th className="px-4 py-4 text-base font-semibold md:text-lg">Tipo de cliente</th>
              <th className="px-4 py-4 text-base font-semibold md:text-lg text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-[#3c5b7f]">Cargando clientes...</td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-[#c53030]">{error instanceof Error ? error.message : 'Error cargando clientes.'}</td>
              </tr>
            ) : filteredClients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-400 italic">No hay clientes disponibles.</td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-[#9adce2] last:border-b-0 hover:bg-[#f8fbff]">
                  <td className="px-6 py-4 text-base font-semibold text-[#0a4d76] md:text-xl">
                    {client.nombreCompleto}
                    <div className="text-sm text-gray-500">{client.correo || '—'}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#4661b0]">{client.identificacion}</td>
                  <td className="px-4 py-4 text-sm text-[#4661b0]">{client.telefono || '—'}</td>
                  <td className="px-4 py-4 text-sm">
                    <div className="mt-1 flex items-center justify-center">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${typeStyles[client.tipoCliente] ?? 'bg-[#d1eaf8] text-[#0f6d8c]'}`}>
                        {client.tipoCliente || 'Contado'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-3 text-[#1f3f6d]">
                      {tienePermiso('Editar clientes') && (
                        <button
                          type="button"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-[#0fa8ad] hover:bg-[#e6fdfd]"
                          onClick={() => navigate(`/Clients-Management/Update-Client/${client.id}`)}
                          aria-label="Editar cliente"
                        >
                          <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                        </button>
                      )}
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-[#2f69c2] hover:bg-[#eff4ff]"
                        onClick={() => navigate(`/Clients-Management/Detail-Client/${client.id}`)}
                        aria-label="Ver historial de cliente"
                      >
                        <FontAwesomeIcon icon={faClock} className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ClientsManagement;
