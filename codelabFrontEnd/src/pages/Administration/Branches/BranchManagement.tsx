import { useState } from "react";
import { useNavigate } from "react-router";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import useListSucursales from "../../../hooks/SucursalesHooks/useListSucursales";
import useChangeSucursalStatus from "../../../hooks/SucursalesHooks/useChangeSucursalStatus";
import CardTotalComponent from "../../../components/cardTotalComponent/CardTotalComponent";
import useAuth from "../../../hooks/useAuth";
import TableComponent from "../../../components/Table/TableComponent";
import TableSucursalesData from "../../../data/dataAdministrator/TablesData/TableSucursalesData";
import { TableSucursalesData as branchHeaders } from "../../../data/dataAdministrator/SucursalesData";
import type { Sucursal } from "../../../interfaces/Sucursales/SucursalInterface";
import PaginacionComponent from "../../../components/Paginacion/PaginacionComponent";

const ITEMS_POR_PAGINA = 8;

const Branches = () => {
  const sucursalesQuery = useListSucursales();
  const statusMutation = useChangeSucursalStatus();
  const navigate = useNavigate();
  const { tienePermiso } = useAuth();

  const [search, setSearch] = useState("");

  const sucursales: Sucursal[] = sucursalesQuery.data?.data ?? [];
  const totalSucursales: number = sucursales.length;
  const sucursalesActivas: number = sucursales.filter((s) => s.activa).length;
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

  const goToForm = (sucursal: Sucursal | null = null) => {
    if (sucursal && sucursal.id) {
      navigate(`/Branches-Management/Update-Sucursal/${sucursal.id}`);
    } else {
      navigate("/Branches-Management/Create-Sucursal");
    }
  };

  /* Paginacion */
  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas: number = Math.ceil(
    filteredSucursales.length / ITEMS_POR_PAGINA,
  );
  const inicio: number = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const fin: number = inicio + ITEMS_POR_PAGINA;
  const sucursalesPaginadas: Sucursal[] = filteredSucursales.slice(inicio, fin);

  const irAPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) setPaginaActual(pagina);
  };

  return (
    <section className="w-full px-4 py-5 md:px-6 bg-[#f3f5f8]">
      <header>
        <h2 className="text-3xl font-bold text-[#0b4d77] md:text-4xl">
          Gestión de Sucursales
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
          {tienePermiso("Crear sucursales") && (
            <ButtonsComponet
              text="Nueva sucursal"
              typeButton="button"
              className="cursor-pointer flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] hover:from-[#034d4a] hover:to-[#2c3d70] px-6 text-base font-semibold text-white md:text-lg"
              icon="fa-solid fa-plus"
              onClick={() => goToForm()}
              disabled={false}
            />
          )}
        </div>
      </div>

      {/* Tarjetas de resumen (Total/Activas/Inactivas) */}
      <div className="mt-6 grid gap-4 md:grid-cols-3 mb-6">
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
      <TableComponent
        tituloTablaInventario={branchHeaders}
        contenidoTabla={
          <TableSucursalesData
            sucursales={sucursalesPaginadas}
            toggleStatus={statusMutation.mutate}
            tienePermiso={tienePermiso}
            goToForm={goToForm}
            isLoading={sucursalesQuery.isLoading}
            isError={sucursalesQuery.isError}
            error={sucursalesQuery.error}
          />
        }
      />

      {/* Paginacion */}

      <PaginacionComponent
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        action={irAPagina}
        inicio={inicio}
        fin={fin}
        registros={sucursalesPaginadas}
      />
    </section>
  );
};

export default Branches;
