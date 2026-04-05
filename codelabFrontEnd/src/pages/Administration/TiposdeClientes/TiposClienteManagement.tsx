import { useState } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";
import useListTiposCliente from "../../../hooks/TiposDeClientesHooks/useListTiposCliente";
import CardTotalComponent from "../../../components/cardTotalComponent/CardTotalComponent";
import TableComponent from "../../../components/Table/TableComponent";
import TableTipoClienteData from "../../../data/dataAdministrator/TablesData/TableTipoClienteData";
import { HeaderTableTipoClienteData } from "../../../data/dataAdministrator/TipoClienteData";
import type { TipoCliente } from "../../../interfaces/TiposdeCliente/TipoClienteInterface";
import PaginacionComponent from "../../../components/Paginacion/PaginacionComponent";
import DetailTipoClienteModal from "../../../components/TipodeCliente/DetailTipoClienteModal";
import ConfirmDeactivateModal from "../../../components/TipodeCliente/ConfirmDeactivateModal";

const ITEMS_POR_PAGINA = 8;

export default function TiposClienteManagement() {
  const tiposClienteQuery = useListTiposCliente();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "activos" | "inactivos">(
    "todos",
  );

  /* Modals state */
  const [detailTipo, setDetailTipo] = useState<TipoCliente | null>(null);
  const [confirmTipo, setConfirmTipo] = useState<TipoCliente | null>(null);

  const tiposCliente: TipoCliente[] = tiposClienteQuery.data?.data ?? [];
  const totalTipos = tiposCliente.length;
  const activos = tiposCliente.filter((t) => t.disponible).length;
  const inactivos = totalTipos - activos;
  const totalClientes = tiposCliente.reduce(
    (acc, t) => acc + (t._count?.clientes ?? 0),
    0,
  );

  const filteredTipos = tiposCliente
    .filter((t) => {
      const term = search.toLowerCase();
      return (
        t.nombre.toLowerCase().includes(term) ||
        (t.descripcion ?? "").toLowerCase().includes(term) ||
        (t.condicionPago ?? "").toLowerCase().includes(term)
      );
    })
    .filter((t) => {
      if (filtro === "activos") return t.disponible;
      if (filtro === "inactivos") return !t.disponible;
      return true;
    })
    .sort((a, b) => (b.disponible === a.disponible ? 0 : b.disponible ? 1 : -1));

  /* Paginación */
  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas = Math.ceil(filteredTipos.length / ITEMS_POR_PAGINA);
  const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const fin = inicio + ITEMS_POR_PAGINA;
  const tiposPaginados = filteredTipos.slice(inicio, fin);

  const irAPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) setPaginaActual(pagina);
  };

  return (
    <section className="w-full px-4 py-5 md:px-6 bg-[#f3f5f8]">
      <div className="flex items-end justify-between">
        <header>
          <h2 className="text-3xl font-bold text-[#0b4d77] md:text-4xl">
            Tipos de Cliente
          </h2>
          <p className="mt-1 text-lg text-[#4661b0] md:text-xl">
            Gestione las categorías de clientes y sus condiciones comerciales
          </p>
        </header>
        <ButtonsComponet
          text=" Nuevo tipo"
          typeButton="button"
          className="cursor-pointer flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] hover:from-[#034d4a] hover:to-[#2c3d70] px-6 text-base font-semibold text-white md:text-lg"
          icon="fa-solid fa-plus"
          onClick={() => navigate("/Tipos-Cliente-Management/Create")}
          disabled={false}
        />
      </div>

      <div className="mt-6 rounded-2xl bg-[#f3f5f8] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <label className="flex h-11 w-full items-center gap-3 rounded-xl border-2 border-[#9adce2] bg-white px-4 md:max-w-120">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-lg text-[#9adce2]"
            />
            <input
              type="text"
              placeholder="Buscar tipos de cliente..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPaginaActual(1);
              }}
              className="w-full bg-transparent text-base text-[#6a758f] placeholder:text-[#8891a7] outline-none md:text-lg"
            />
          </label>

          <div className="flex items-center gap-2">
            {/* Filtros */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setFiltro("todos");
                  setPaginaActual(1);
                }}
                className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold md:text-base ${
                  filtro === "todos"
                    ? "bg-[#0aa6a2] text-white"
                    : "bg-white text-[#4661b0] border border-[#9adce2]"
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => {
                  setFiltro("activos");
                  setPaginaActual(1);
                }}
                className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold md:text-base ${
                  filtro === "activos"
                    ? "bg-[#009b3a] text-white"
                    : "bg-white text-[#4661b0] border border-[#9adce2]"
                }`}
              >
                Activos
              </button>
              <button
                type="button"
                onClick={() => {
                  setFiltro("inactivos");
                  setPaginaActual(1);
                }}
                className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold md:text-base ${
                  filtro === "inactivos"
                    ? "bg-[#e10000] text-white"
                    : "bg-white text-[#4661b0] border border-[#9adce2]"
                }`}
              >
                Inactivos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="mt-6 grid gap-4 md:grid-cols-4 mb-6">
        <CardTotalComponent
          title="Total de tipos"
          total={totalTipos}
          colorNumber="text-[#0a4d76]"
        />
        <CardTotalComponent
          title="Tipos activos"
          total={activos}
          colorNumber="text-[#009b3a]"
        />
        <CardTotalComponent
          title="Tipos inactivos"
          total={inactivos}
          colorNumber="text-[#e10000]"
        />
        <CardTotalComponent
          title="Clientes asignados"
          total={totalClientes}
          colorNumber="text-[#4661b0]"
        />
      </div>

      {/* Tabla de tipos de cliente */}
      <TableComponent
        tituloTablaInventario={HeaderTableTipoClienteData}
        contenidoTabla={
          <TableTipoClienteData
            tiposCliente={tiposPaginados}
            onView={(tc) => setDetailTipo(tc)}
            onEdit={(tc) => navigate(`/Tipos-Cliente-Management/Update/${tc.id}`)}
            onToggleStatus={(tc) => setConfirmTipo(tc)}
            isLoading={tiposClienteQuery.isLoading}
            isError={tiposClienteQuery.isError}
            error={tiposClienteQuery.error}
          />
        }
      />

      {/* Paginación */}
      <PaginacionComponent
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        action={irAPagina}
        inicio={inicio}
        fin={fin}
        registros={filteredTipos}
      />

      {/* Modales */}
      {detailTipo && (
        <DetailTipoClienteModal
          tipoCliente={detailTipo}
          onClose={() => setDetailTipo(null)}
          onEdit={(tc) => {
            setDetailTipo(null);
            navigate(`/Tipos-Cliente-Management/Update/${tc.id}`);
          }}
        />
      )}

      {confirmTipo && (
        <ConfirmDeactivateModal
          tipoCliente={confirmTipo}
          onClose={() => setConfirmTipo(null)}
        />
      )}
    </section>
  );
}
