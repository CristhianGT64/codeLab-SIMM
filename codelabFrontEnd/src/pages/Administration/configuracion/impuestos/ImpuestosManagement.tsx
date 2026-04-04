import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import ButtonsComponet from "../../../../components/buttonsComponents/ButtonsComponet";
import CardTotalComponent from "../../../../components/cardTotalComponent/CardTotalComponent";
import HeaderTitleAdmin from "../../../../components/headers/HeaderAdmin";
import PaginacionComponent from "../../../../components/Paginacion/PaginacionComponent";
import TableComponent from "../../../../components/Table/TableComponent";
import {
  HeaderImpuestosManagement,
  HeaderTableImpuestos,
} from "../../../../data/dataAdministrator/ImpuestosData";
import TableImpuestosData from "../../../../data/dataAdministrator/TablesData/TableImpuestosData";
import useListImpuestos from "../../../../hooks/ConfiguracionHooks/useListImpuestos";
import type { ImpuestoConfiguracion } from "../../../../interfaces/Configuracion/ImpuestoInterface";

const ITEMS_POR_PAGINA = 8;

export default function ImpuestosManagement() {
  const navigate = useNavigate();
  const impuestosQuery = useListImpuestos();
  const [search, setSearch] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const impuestos = useMemo(
    () => impuestosQuery.data?.data ?? [],
    [impuestosQuery.data?.data],
  );

  const filteredImpuestos = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return impuestos;
    }

    return impuestos.filter((impuesto) => {
      const porcentaje = impuesto.porcentaje.toFixed(2);
      const tasa = impuesto.tasa.toFixed(4);

      return (
        impuesto.nombre.toLowerCase().includes(term) ||
        porcentaje.includes(term) ||
        tasa.includes(term)
      );
    });
  }, [impuestos, search]);

  const resumen = useMemo(() => {
    if (impuestos.length === 0) {
      return {
        total: 0,
        promedio: 0,
        maximo: 0,
        minimo: 0,
      };
    }

    const porcentajes = impuestos.map((impuesto) => impuesto.porcentaje);
    const total = porcentajes.reduce((acc, porcentaje) => acc + porcentaje, 0);

    return {
      total: impuestos.length,
      promedio: Number((total / impuestos.length).toFixed(2)),
      maximo: Math.max(...porcentajes),
      minimo: Math.min(...porcentajes),
    };
  }, [impuestos]);

  const totalPaginas = Math.ceil(filteredImpuestos.length / ITEMS_POR_PAGINA);
  const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const fin = inicio + ITEMS_POR_PAGINA;
  const impuestosPaginados: ImpuestoConfiguracion[] = filteredImpuestos.slice(
    inicio,
    fin,
  );

  const irAPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
    }
  };

  return (
    <section className="w-full bg-[#f3f5f8] px-4 py-5 md:px-6">
      <div className="flex items-end justify-between gap-4">
        <HeaderTitleAdmin {...HeaderImpuestosManagement} />

        <ButtonsComponet
          text="Nuevo Impuesto"
          typeButton="button"
          className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] px-6 text-base font-semibold text-white hover:from-[#034d4a] hover:to-[#2c3d70] md:text-lg"
          icon="fa-solid fa-plus"
          onClick={() => navigate("/Configuracion/Impuestos/Create")}
          disabled={false}
        />
      </div>

      <div className="mt-6 rounded-2xl bg-[#f3f5f8] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
        <label className="flex h-11 w-full items-center gap-3 rounded-xl border-2 border-[#9adce2] bg-white px-4 md:max-w-120">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-lg text-[#9adce2]"
          />
          <input
            type="text"
            placeholder="Buscar por nombre, porcentaje o tasa..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPaginaActual(1);
            }}
            className="w-full bg-transparent text-base text-[#6a758f] placeholder:text-[#8891a7] outline-none md:text-lg"
          />
        </label>
      </div>

      <div className="mt-6 mb-6 grid gap-4 md:grid-cols-4">
        <CardTotalComponent
          title="Total impuestos"
          total={resumen.total}
          colorNumber="text-[#0a4d76]"
        />
        <CardTotalComponent
          title="Promedio"
          total={resumen.promedio}
          colorNumber="text-[#4661b0]"
        />
        <CardTotalComponent
          title="Porcentaje maximo"
          total={resumen.maximo}
          colorNumber="text-[#0aa6a2]"
        />
        <CardTotalComponent
          title="Porcentaje minimo"
          total={resumen.minimo}
          colorNumber="text-[#0a4d76]"
        />
      </div>

      <TableComponent
        tituloTablaInventario={HeaderTableImpuestos}
        contenidoTabla={
          <TableImpuestosData
            impuestos={impuestosPaginados}
            onEdit={(impuesto) =>
              navigate(`/Configuracion/Impuestos/Update/${impuesto.id}`)
            }
            isLoading={impuestosQuery.isLoading}
            isError={impuestosQuery.isError}
            error={impuestosQuery.error}
          />
        }
      />

      {filteredImpuestos.length > 0 && (
        <PaginacionComponent
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          action={irAPagina}
          inicio={inicio}
          fin={fin}
          registros={filteredImpuestos}
        />
      )}
    </section>
  );
}
