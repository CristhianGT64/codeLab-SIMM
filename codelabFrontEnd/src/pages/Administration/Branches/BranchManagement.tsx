import { useState } from 'react';
import { useNavigate } from 'react-router';
import ButtonsComponet from '../../../components/buttonsComponents/ButtonsComponet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPowerOff,
  faPenToSquare,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import useListSucursales from '../../../hooks/SucursalesHooks/useListSucursales';
import useChangeSucursalStatus from '../../../hooks/SucursalesHooks/useChangeSucursalStatus';
import CardTotalComponent from '../../../components/cardTotalComponent/CardTotalComponent';

const Branches = () => {
  const sucursalesQuery = useListSucursales();
  const statusMutation = useChangeSucursalStatus();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');

  const sucursales = (sucursalesQuery.data?.data || []) as any[];
  const totalSucursales: number = sucursales.length;
  const sucursalesActivas: number = sucursales.filter((s: any) => s.activa).length;
  const sucursalesInactivas: number = totalSucursales - sucursalesActivas;

  // filtrar y ordenar: las activas arriba, luego inactivas
  const filteredSucursales = sucursales
    .filter((s) => {
      const term = search.toLowerCase();
      return (
        s.nombre.toLowerCase().includes(term) ||
        s.direccion.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => (b.activa === a.activa ? 0 : b.activa ? 1 : -1));

  const goToForm = (sucursal: any = null) => {
    if (sucursal && sucursal.id) {
      navigate(`/Branches-Management/Update-Sucursal/${sucursal.id}`);
    } else {
      navigate('/Branches-Management/Create-Sucursal');
    }
  };

  return (
    <section className="w-full px-4 py-5 md:px-6 bg-[#f3f5f8]">
      <header>
        <h2 className="text-3xl font-bold text-[#0b4d77] md:text-4xl">
          Gestión de sucursales
        </h2>
        <p className="mt-1 text-lg text-[#4661b0] md:text-xl">
          Panel administrativo
        </p>
      </header>

      <div className="mt-6 rounded-2xl bg-[#f3f5f8] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <label className="flex h-11 w-full items-center gap-3 rounded-xl border-2 border-[#9adce2] bg-white px-4 md:max-w-120">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-lg text-[#9adce2]"
            />
            <input
              type="text"
              placeholder="Buscar sucursales..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-base text-[#6a758f] placeholder:text-[#8891a7] outline-none md:text-lg"
            />
          </label>
          <ButtonsComponet
            text="Nueva sucursal"
            typeButton="button"
            className="cursor-pointer flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] hover:from-[#034d4a] hover:to-[#2c3d70] px-6 text-base font-semibold text-white md:text-lg"
            icon="fa-solid fa-plus"
            onClick={() => goToForm()}
            disabled={false}
          />
        </div>
      </div>

      {/* Tarjetas de resumen (Total/Activas/Inactivas) */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <CardTotalComponent
          title="Total de Suscursales"
          total={totalSucursales}
          colorNumber="text-[#0a4d76]"
        />
        <CardTotalComponent
          title="Sucursales Activas"
          total={sucursalesActivas}
          colorNumber="text-[#009b3a]"
        />
        <CardTotalComponent
          title="Sucursales Inactivas"
          total={sucursalesInactivas}
          colorNumber="text-[#e10000]"
        />
      </div>

      {/* Tabla de Sucursales */}
      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-left text-white">
              <th className="px-6 py-4 text-base font-semibold md:text-lg">
                Sucursal / Dirección
              </th>
              <th className="px-4 py-4 text-base font-semibold md:text-lg">
                Gerente
              </th>
              <th className="px-4 py-4 text-base font-semibold md:text-lg text-center">
                Estado
              </th>
              <th className="px-4 py-4 text-base font-semibold md:text-lg text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSucursales.length > 0 ? (
              filteredSucursales.map((s: any) => (
                <tr
                  key={s.id}
                  className="border-b border-[#9adce2] last:border-b-0"
                >
                  <td className="px-6 py-4 text-base font-semibold text-[#0a4d76] md:text-xl">
                    {s.nombre}
                    <div className="text-sm text-gray-500 italic">{s.direccion}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#4661b0] md:text-lg">
                    {s.gerente}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex rounded-full ${
                      s.activa
                        ? 'bg-[#b7e4ca] text-[#008444]'
                        : 'bg-[#86817f] text-[#efeeee]'
                    } px-4 py-1 text-sm font-semibold  md:text-base`}>
                      {s.activa ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-4 text-lg md:text-xl">
                      <button
                        type="button"
                        className={`cursor-pointer ${
                          s.activa
                            ? 'text-[#ff5e00] hover:text-[#b64402]'
                            : 'text-[#24e775] hover:text-[#008444]'
                        } `}
                        aria-label={`Cambiar estado de ${s.nombre}`}
                        onClick={() =>
                          statusMutation.mutate(s.id)
                        }
                      >
                        <FontAwesomeIcon icon={faPowerOff} />
                      </button>
                      <button
                        type="button"
                        onClick={() => goToForm(s)}
                        className="cursor-pointer text-[#00a3b8] hover:text-[#007786]"
                        aria-label={`Editar ${s.nombre}`}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-400 italic">
                  No hay datos disponibles en este momento.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Branches;