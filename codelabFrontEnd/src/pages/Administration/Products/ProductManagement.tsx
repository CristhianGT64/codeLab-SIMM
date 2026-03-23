import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";
import CardTotalComponent from "../../../components/cardTotalComponent/CardTotalComponent";
import {
  HeaderProducts,
  HeaderTableProductData,
} from "../../../data/dataAdministrator/ProductManagment";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import { useNavigate } from "react-router";
import useListProduct from "../../../hooks/ProductosHooks/useListProduct";
import { useMemo, useState } from "react";
import useInactiveProducto from "../../../hooks/ProductosHooks/useInactiveProducto";
import useActivateProducto from "../../../hooks/ProductosHooks/useActiveProducto";
import settings from "../../../lib/settings";
import useAuth from "../../../hooks/useAuth";
import TableComponent from "../../../components/Table/TableComponent";
import TableProductData from "../../../data/dataAdministrator/TablesData/TablaProductos";
import type { ProductoDto } from "../../../interfaces/Products/FormProducts";
import PaginacionComponent from "../../../components/Paginacion/PaginacionComponent";

const ITEMS_POR_PAGINA = 8;

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

  const filtredProduct = useMemo(() => {
    if (!searchProduct.trim()) return mockProducts;

    const searchLower = searchProduct.toLocaleLowerCase();
    return mockProducts.filter(
      (product) =>
        product.nombre.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.categoria.nombre.toLowerCase().includes(searchLower),
    );
  }, [mockProducts, searchProduct]);

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

  /* Paginacion */
  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas: number = Math.ceil(
    filtredProduct.length / ITEMS_POR_PAGINA,
  );
  const inicio: number = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const fin: number = inicio + ITEMS_POR_PAGINA;
  const sucursalesPaginadas: ProductoDto[] = filtredProduct.slice(inicio, fin);

  const irAPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) setPaginaActual(pagina);
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
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="mt-6 grid gap-4 md:grid-cols-4 mb-6">
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

      <TableComponent
        tituloTablaInventario={HeaderTableProductData}
        contenidoTabla={
          <TableProductData
            productos={sucursalesPaginadas}
            tienePermiso={tienePermiso}
            isLoading={isLoading}
            isError={isError}
            error={error}
            inactiveProduct={inactiveProduct.mutate}
            activeProduct={activeProduct.mutate}
            navigate={navigate}
            getProductImageUrl={getProductImageUrl}
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
}
