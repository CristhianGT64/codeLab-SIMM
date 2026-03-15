import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPowerOff,
  faPenToSquare,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";
import CardTotalComponent from "../../../components/cardTotalComponent/CardTotalComponent";
import {
  TableProductData,
  HeaderProducts,
} from "../../../data/dataAdministrator/ProductManagment";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import { useNavigate } from "react-router";
import useListProduct from "../../../hooks/ProductosHooks/useListProduct";
import { useMemo, useState } from "react";
import useInactiveProducto from "../../../hooks/ProductosHooks/useInactiveProducto";
import useActivateProducto from "../../../hooks/ProductosHooks/useActiveProducto";
import settings from "../../../lib/settings";
import useAuth from "../../../hooks/useAuth";

const categoryStyles: Record<string, string> = {
  Tecnología: "bg-[#104f78] text-white",
  Muebles: "bg-[#0aa6a2] text-white",
  Papelería: "bg-[#4661b0] text-white",
};

export default function ProductManagement() {
  const { data: listProduct, isLoading, isError, error } = useListProduct();
  const mockProducts = listProduct?.data ?? [];
  const inactiveProduct = useInactiveProducto();
  const activeProduct = useActivateProducto();
  const { tienePermiso } = useAuth();

  const summary = useMemo(() => {
    const toNumber = (value: string | number | null | undefined) => {
      if (typeof value === "number") {
        return Number.isFinite(value) ? value : 0;
      }

      if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
      }

      return 0;
    };

    const totalProductos = mockProducts.length;
    const productosActivos = mockProducts.filter(
      (product) => product.estado?.toLowerCase() === "activo",
    ).length;

    const stockTotal = mockProducts.reduce((acc, product) => {
      const stockProducto = product.inventarios.reduce(
        (stockAcc, inventario) => stockAcc + toNumber(inventario.stockActual),
        0,
      );
      return acc + stockProducto;
    }, 0);

    const valorInventario = mockProducts.reduce((acc, product) => {
      const costo = toNumber(product.costo);
      const stockProducto = product.inventarios.reduce(
        (stockAcc, inventario) => stockAcc + toNumber(inventario.stockActual),
        0,
      );
      return acc + costo * stockProducto;
    }, 0);

    return {
      totalProductos,
      productosActivos,
      stockTotal,
      valorInventario: Number(valorInventario.toFixed(2)),
    };
  }, [mockProducts]);

  const [searchProduct, setSearchProduct] = useState<string>("");

  const filtredUser = useMemo(() => {
    if (!searchProduct.trim()) return mockProducts;

    const searchLower = searchProduct.toLocaleLowerCase();
    return mockProducts.filter(
      (product) =>
        product.nombre.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.categoria.nombre.toLowerCase().includes(searchLower),
    );
  }, [mockProducts, searchProduct]);

  const tableHeader: string[] = TableProductData;
  const navigate = useNavigate();

  const getProductImageUrl = (imagenPath: string | null) => {
    if (!imagenPath) return null;
    if (/^https?:\/\//i.test(imagenPath)) return imagenPath;

    const baseUrl = settings.URL.replace(/\/$/, "");
    const normalizedPath = imagenPath.startsWith("/")
      ? imagenPath
      : `/${imagenPath}`;

    return `${baseUrl}${normalizedPath}`;
  };

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
              onChange={(event) => setSearchProduct(event.target.value)}
            />
          </label>

          {tienePermiso("Crear productos") && (
            <ButtonsComponet
              text="Nuevo Producto"
              typeButton="button"
              className="cursor-pointer flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] hover:from-[#034d4a] hover:to-[#2c3d70] px-6 text-base font-semibold text-white md:text-lg"
              icon="fa-solid fa-plus"
              onClick={() => navigate("/Product-Management/Create-Product")}
              disabled={false}
            />
          )}

          {tienePermiso("Eliminar Producto") && (
                        <ButtonsComponet
              text="Eliminar Producto"
              typeButton="button"
              className="cursor-pointer flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] hover:from-[#034d4a] hover:to-[#2c3d70] px-6 text-base font-semibold text-white md:text-lg"
              icon="fa-solid fa-plus"
              onClick={() => navigate("/Product-Management/Create-Product")}
              disabled={false}
            />
          )}
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <CardTotalComponent
          title="Total Productos"
          total={summary.totalProductos}
          colorNumber="text-[#0a4d76]"
        />
        <CardTotalComponent
          title="Productos Activos"
          total={summary.productosActivos}
          colorNumber="text-[#009b3a]"
        />
        <CardTotalComponent
          title="Valor Inventario"
          total={summary.valorInventario}
          colorNumber="text-[#0aa6a2]"
          isCurrency
        />
        <CardTotalComponent
          title="Stock Total"
          total={summary.stockTotal}
          colorNumber="text-[#0a4d76]"
        />
      </div>

      {/* Tabla de productos */}
      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
        {isLoading && (
          <p className="px-6 py-4 text-[#4661b0]">Cargando productos...</p>
        )}
        {isError && (
          <p className="px-6 py-4 text-[#c20000]">
            {error instanceof Error ? error.message : "Error cargando productos"}
          </p>
        )}
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
              {filtredUser.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[#9adce2] last:border-b-0"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-[#e8f4f6] text-[#0aa6a2]">
                        {getProductImageUrl(product.imagenPath) ? (
                          <img
                            src={
                              getProductImageUrl(product.imagenPath) ??
                              undefined
                            }
                            alt={product.nombre}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faBoxOpen}
                            className="text-lg"
                          />
                        )}
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
                      className={`inline-flex rounded-full px-4 py-1 text-sm font-semibold md:text-base ${categoryStyles[product.categoria.nombre] ?? "bg-[#9dd8df] text-[#0a4d76]"}`}
                    >
                      {product.categoria.nombre}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-medium text-[#0a4d76] md:text-base">
                    L {product.precioVenta}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-[#6a758f] md:text-base">
                    L {product.costo}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-semibold text-[#0aa6a2] md:text-base">
                      {(
                        (product.precioVenta - product.costo) /
                        product.precioVenta
                      ).toFixed(2)}
                      %
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-[#4661b0] md:text-base">
                    {`${product.inventarios.reduce((acc, inventario) => acc + inventario.stockActual, 0)} ${product.unidadMedida}`}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex rounded-full ${
                        product.estado === "activo"
                          ? "bg-[#b7e4ca] text-[#008444]"
                          : "bg-[#86817f] text-[#efeeee]"
                      } px-4 py-1 text-sm font-semibold md:text-base`}
                    >
                      {product.estado === "activo" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-4 text-lg md:text-xl">
                      {tienePermiso("Editar productos") && (
                        <button
                          type="button"
                          className={`cursor-pointer ${
                            product.estado === "activo"
                              ? "text-[#ff5e00] hover:text-[#b64402]"
                              : "text-[#24e775] hover:text-[#008444]"
                          }`}
                          aria-label={`Cambiar estado de ${product.nombre}`}
                          onClick={
                            product.estado === "activo"
                              ? () => inactiveProduct.mutate(product.id)
                              : () => activeProduct.mutate(product.id)
                          }
                        >
                          <FontAwesomeIcon icon={faPowerOff} />
                        </button>
                      )}
                      {tienePermiso("Editar productos") && (
                        <button
                          type="button"
                          className="cursor-pointer text-[#00a3b8] hover:text-[#007786]"
                          aria-label={`Editar ${product.nombre}`}
                          onClick={() =>
                            navigate(
                              `/Product-Management/Update-Product/${product.id}`,
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                      )}
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
