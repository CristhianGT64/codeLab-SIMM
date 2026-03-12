import { DashboardDataAdmin } from "../../data/dataAdministrator/DashboardDataAdmin";
import type { DashboardInterface } from "../../interfaces/DashboardInterface";
import LinkCard from "../../components/cardsAdministrator/LinksCards";
import useAuth from "../../hooks/useAuth";

export default function Dashboard() {
  const { tienePermiso } = useAuth();
  const dataDashboard: DashboardInterface[] = DashboardDataAdmin.filter(
    (item) => !item.permiso || tienePermiso(item.permiso),
  );

  return (
    <section className="px-6 py-8">
      <h2 className="text-2xl font-semibold text-[#24364d] mb-6">Dashboard</h2>

      {/* Grid de tarjetas - 1 col en móvil, 2 en tablet, 3-4 en desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dataDashboard.map((dataLink: DashboardInterface) => (
          <LinkCard key={dataLink.url} {...dataLink} />
        ))}
      </div>
    </section>
  );
}
