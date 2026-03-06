import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPowerOff,
  faPenToSquare,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";
import CardTotalComponent from "../../../components/cardTotalComponent/CardTotalComponent";
import { TableProductData, HeaderProducts } from "../../../data/dataAdministrator/ProductManagment";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import { useNavigate } from "react-router";

const categoryStyles: Record<string, string> = {
  Tecnología: "bg-[#104f78] text-white",
  Muebles: "bg-[#0aa6a2] text-white",
  Papelería: "bg-[#4661b0] text-white",
};

const mockProducts = [
  {
    id: 1,
    nombre: "Laptop Dell Inspiron 15",
    sku: "TECH-LAP-001",
    categoria: "Tecnología",
    precioVenta: 899.99,
    costo: 650,
    margen: 27.8,
    stock: 25,
    unidad: "Unidad",
    estado: "activo",
  },
  {
    id: 2,
    nombre: "Mouse Inalámbrico Logitech",
    sku: "TECH-MOU-002",
    categoria: "Tecnología",
    precioVenta: 29.99,
    costo: 15,
    margen: 50,
    stock: 150,
    unidad: "Unidad",
    estado: "activo",
  },
  {
    id: 3,
    nombre: "Escritorio Ejecutivo",
    sku: "MUEBLE-ESC-001",
    categoria: "Muebles",
    precioVenta: 350,
    costo: 200,
    margen: 42.9,
    stock: 10,
    unidad: "Unidad",
    estado: "inactivo",
  },
  {
    id: 4,
    nombre: "Cuaderno Profesional",
    sku: "PAPELERIA-CUA-001",
    categoria: "Papelería",
    precioVenta: 5.99,
    costo: 2.5,
    margen: 58.3,
    stock: 500,
    unidad: "Unidad",
    estado: "activo",
  },
];

export default function ProductManagement() {
  const tableHeader: string[] = TableProductData;
  const navigate = useNavigate();

  return (
    <section className="w-full px-4 py-5 md:px-6">
      <HeaderTitleAdmin {...HeaderProducts} />

      {/* Barra de búsqueda y botón nuevo producto */}
      <div className="mt-6 rounded-2xl bg-[#f3f5f8] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <label className="flex h-11 w-full items-center gap-3 rounded-xl border-2 border-[#9adce2] bg-white px-4 md:max-w-120">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-lg text-[#9adce2]"
            />
            <input
              type="text"
              placeholder="Buscar por nombre, SKU o categoría..."
              className="w-full bg-transparent text-base text-[#6a758f] placeholder:text-[#8891a7] outline-none md:text-lg"
            />
          </label>

          <ButtonsComponet
            text="Nuevo Producto"
            typeButton="button"
            className="cursor-pointer flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] hover:from-[#034d4a] hover:to-[#2c3d70] px-6 text-base font-semibold text-white md:text-lg"
            icon="fa-solid fa-plus"
            onClick={() => navigate('/Product-Management/Create-Product')}
            disabled={false}
          />
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <CardTotalComponent
          title="Total Productos"
          total={4}
          colorNumber="text-[#0a4d76]"
        />
        <CardTotalComponent
          title="Productos Activos"
          total={3}
          colorNumber="text-[#009b3a]"
        />
        <CardTotalComponent
          title="Valor Inventario"
          total={21750.0}
          colorNumber="text-[#0aa6a2]"
        />
        <CardTotalComponent
          title="Stock Total"
          total={300}
          colorNumber="text-[#0a4d76]"
        />
      </div>

      {/* Tabla de productos */}
      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-left text-white">
                {tableHeader.map((item: string, index: number) => (
                  <th
                    key={`${index}-${item}`}
                    className="px-6 py-4 text-base font-semibold md:text-lg text-center"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[#9adce2] last:border-b-0"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8f4f6] text-[#0aa6a2]">
                        <FontAwesomeIcon icon={faBoxOpen} className="text-lg" />
                      </div>
                      <span className="text-base font-semibold text-[#0a4d76] md:text-lg">
                        {product.nombre}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#4661b0] md:text-base">
                    {product.sku}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-4 py-1 text-sm font-semibold md:text-base ${categoryStyles[product.categoria] ?? "bg-[#9dd8df] text-[#0a4d76]"}`}
                    >
                      {product.categoria}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-medium text-[#0a4d76] md:text-base">
                    ${product.precioVenta.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-[#6a758f] md:text-base">
                    ${product.costo.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-semibold text-[#0aa6a2] md:text-base">
                      {product.margen.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-[#4661b0] md:text-base">
                    {product.stock} {product.unidad}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex rounded-full ${
                        product.estado === "activo"
                          ? "bg-[#b7e4ca] text-[#008444]"
                          :  "bg-[#86817f] text-[#efeeee]"
                      } px-4 py-1 text-sm font-semibold md:text-base`}
                    >
                      {product.estado === "activo" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-4 text-lg md:text-xl">
                      <button
                        type="button"
                        className={`cursor-pointer ${
                          product.estado === "activo"
                            ? "text-[#ff5e00] hover:text-[#b64402]"
                            : "text-[#24e775] hover:text-[#008444]"
                        }`}
                        aria-label={`Cambiar estado de ${product.nombre}`}
                      >
                        <FontAwesomeIcon icon={faPowerOff} />
                      </button>
                      <button
                        type="button"
                        className="cursor-pointer text-[#00a3b8] hover:text-[#007786]"
                        aria-label={`Editar ${product.nombre}`}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
