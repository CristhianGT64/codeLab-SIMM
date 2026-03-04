import { DashboardDataAdmin } from "../../data/dataAdministrator/DashboardDataAdmin";
import type { DashboardInterface } from "../../interfaces/DashboardInterface";
import LinkCard from "../../components/cardsAdministrator/LinksCards";

export default function Dashboard() {
  const dataDashboard: DashboardInterface[] = DashboardDataAdmin;

  return (
    <section className="px-6 py-8">
      <h2 className="text-2xl font-semibold text-[#24364d] mb-6">Dashboard</h2>

      {/* Grid de tarjetas - 1 col en móvil, 2 en tablet, 3-4 en desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Tarjetas */}

        {dataDashboard.map((dataLink: DashboardInterface) => (
          <LinkCard {...dataLink} />
        ))}
      </div>
    </section>
  );
}
