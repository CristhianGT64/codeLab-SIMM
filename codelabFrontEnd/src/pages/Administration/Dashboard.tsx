import { DashboardDataAdmin } from "../../data/dataAdministrator/DashboardDataAdmin";
import type { DashboardInterface } from "../../interfaces/DashboardInterface";
import LinkCard from "../../components/cardsAdministrator/LinksCards";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import PaginacionComponent from "../../components/Paginacion/PaginacionComponent";

const ITEMS_POR_PAGINA = 8;

export default function Dashboard() {
  const { tienePermiso } = useAuth();
  const dataDashboard: DashboardInterface[] = DashboardDataAdmin.filter(
    (item) => !item.permiso || tienePermiso(item.permiso),
  );

  /* Paginacion */
  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas: number = Math.ceil(dataDashboard.length / ITEMS_POR_PAGINA);
  const inicio: number = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const fin: number = inicio + ITEMS_POR_PAGINA;
  const cardsPaginados: DashboardInterface[] = dataDashboard.slice(inicio, fin);

  const irAPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) setPaginaActual(pagina);
  };


  return (
    <section className="px-6 py-8">
      <h2 className="text-2xl font-semibold text-[#24364d] mb-6">Dashboard</h2>

      {/* Grid de tarjetas - 1 col en móvil, 2 en tablet, 3-4 en desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cardsPaginados.map((dataLink: DashboardInterface) => (
          <LinkCard key={dataLink.url} {...dataLink} />
        ))}
      </div>

      {/* Paginación */}
      <PaginacionComponent
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        action={irAPagina}
        inicio={inicio}
        fin={fin}
        registros={cardsPaginados}
      />
    </section>
  );
}
