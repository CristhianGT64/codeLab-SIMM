import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useClients } from "../../../hooks/ClientesHooks/useClients";
import useAuth from "../../../hooks/useAuth";
import CardTotalComponent from "../../../components/cardTotalComponent/CardTotalComponent";
import type { Client } from "../../../interfaces/Clients/ClientInterface";
import TableComponent from "../../../components/Table/TableComponent";
import { HeaderTableClientData } from "../../../data/dataAdministrator/ClienteData";
import TableClientData from "../../../data/dataAdministrator/TablesData/TablaClientes";
import PaginacionComponent from "../../../components/Paginacion/PaginacionComponent";

const ITEMS_POR_PAGINA = 8;

const ClientsManagement = () => {
  const navigate = useNavigate();
  const { data: clients, isLoading, isError, error } = useClients();
  const [term, setTerm] = useState("");
  const { tienePermiso } = useAuth();

  const list: Client[] = clients ?? [];
  const totalClients = list.length;
  const mayoristaCount = list.filter((c) =>
    c.tipoCliente?.toLowerCase().includes("mayor"),
  ).length;
  const minoristaCount = list.filter((c) =>
    c.tipoCliente?.toLowerCase().includes("minor"),
  ).length;

  const filteredClients = useMemo<Client[]>(() => {
    if (!term.trim()) return list;
    const lower = term.toLowerCase();
    return list.filter((client) =>
      [client.nombreCompleto, client.identificacion, client.correo]
        .join(" ")
        .toLowerCase()
        .includes(lower),
    );
  }, [list, term]);

  /* Paginacion */
  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas: number = Math.ceil(
    filteredClients.length / ITEMS_POR_PAGINA,
  );
  const inicio: number = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const fin: number = inicio + ITEMS_POR_PAGINA;
  const clientesPaginados: Client[] = filteredClients.slice(inicio, fin);

  const irAPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) setPaginaActual(pagina);
  };

  return (
    <section className="w-full px-4 py-5 md:px-6 bg-[#f3f5f8]">
      <header>
        <h2 className="text-3xl font-bold text-[#0b4d77] md:text-4xl">
          Gestión de Clientes
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
              placeholder="Buscar clientes por su nombre o DNI..."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full bg-transparent text-base text-[#6a758f] placeholder:text-[#8891a7] outline-none md:text-lg"
            />
          </label>
          {tienePermiso("Crear clientes") && (
            <button
              type="button"
              className="cursor-pointer flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] px-6 text-base font-semibold text-white hover:from-[#034d4a] hover:to-[#2c3d70]"
              onClick={() => navigate("/Clients-Management/Create-Client")}
            >
              + Nuevo Cliente
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3 mb-6">
        <CardTotalComponent
          title="Total de clientes"
          total={totalClients}
          colorNumber="text-[#0a4d76]"
        />
        <CardTotalComponent
          title="Clientes mayoristas"
          total={mayoristaCount}
          colorNumber="text-[#0a6b7d]"
        />
        <CardTotalComponent
          title="Clientes minoristas"
          total={minoristaCount}
          colorNumber="text-[#0b6b2d]"
        />
      </div>

      {/* Tabla y paginacion */}

      <TableComponent
        tituloTablaInventario={HeaderTableClientData}
        contenidoTabla={
          <TableClientData
            clientes={clientesPaginados}
            tienePermiso={tienePermiso}
            isLoading={isLoading}
            isError={isError}
            error={error}
            navigate={navigate}
          />
        }
      />

      {/* Paginacion */}

      <PaginacionComponent
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        action={irAPagina}
        registros={filteredClients}
        inicio={inicio}
        fin={fin}
      />
    </section>
  );
};

export default ClientsManagement;
