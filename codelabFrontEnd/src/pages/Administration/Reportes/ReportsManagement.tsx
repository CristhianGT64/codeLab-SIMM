import { faChartColumn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LinkCard from "../../../components/cardsAdministrator/LinksCards";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import type { DashboardInterface } from "../../../interfaces/DashboardInterface";
import type { HeaderAdmin } from "../../../interfaces/Headers/HeaderInterface";

const reportsHeader: HeaderAdmin = {
  title: "Modulo de Reportes",
  subTitle: "Analiza el rendimiento del negocio con reportes claros por area.",
};

const reportsCards: DashboardInterface[] = [
  {
    svg: "M3 13.5 8.25 8.25l4.5 4.5 7.5-7.5M3.75 20.25h16.5",
    title: "Ventas por Sucursal",
    description:
      "Consulta ventas, transacciones e ingreso generado por cada sucursal en un periodo.",
    buttonDescription: "Abrir reporte →",
    colorBorder: "border-[#4a6eb0]",
    colorSvg: "from-[#109c9a] to-[#4a6eb0]",
    url: "/Reportes-Management/Ventas-Sucursales",
  },
];

export default function ReportsManagement() {
  return (
    <section className="p-6 h-full">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-start gap-4">
          <div className="rounded-[28px] bg-linear-to-br from-[#109c9a] to-[#4a6eb0] p-5 shadow-[0_10px_24px_rgba(10,64,89,0.16)]">
            <FontAwesomeIcon icon={faChartColumn} className="text-4xl text-white" />
          </div>
          <HeaderTitleAdmin {...reportsHeader} />
        </div>

        <div className="mb-8 rounded-[30px] bg-white p-6 shadow-[0_12px_34px_rgba(10,64,89,0.10)]">
          <p className="text-lg leading-8 text-[#4661b0]">
            Este modulo concentra reportes operativos y comerciales. Por ahora ya
            queda disponible el reporte de ventas por sucursal para comparar el
            comportamiento de cada punto de venta dentro del periodo seleccionado.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {reportsCards.map((reportCard) => (
            <LinkCard key={reportCard.url} {...reportCard} />
          ))}
        </div>
      </div>
    </section>
  );
}
