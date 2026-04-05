import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faPenToSquare,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
import type { ProductoDto } from "../../../interfaces/Products/FormProducts";

interface Props {
  productos: ProductoDto[];
  tienePermiso: (permiso: string) => boolean;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  inactiveProduct: (id: string) => void;
  activeProduct: (id: string) => void;
  navigate: (path: string) => void;
  getProductImageUrl: (imagenPath: string | null) => string | null;
}

export default function TableProductData({
  productos,
  tienePermiso,
  isLoading,
  isError,
  error,
  inactiveProduct,
  activeProduct,
  navigate,
  getProductImageUrl,
}: Props) {
  const categoryStyles: Record<string, string> = {
    Tecnología: "bg-[#104f78] text-white",
    Muebles: "bg-[#0aa6a2] text-white",
    Papelería: "bg-[#4661b0] text-white",
  };
  if (isLoading) {
    return (
      <tr>
        <td colSpan={10} className="text-center py-12 text-[#6b7a8f]">
          Cargando productos...
        </td>
      </tr>
    );
  }

  if (isError) {
    return (
      <tr>
        <td colSpan={10} className="text-center py-12 text-[#c20000]">
          {error instanceof Error ? error.message : "Error cargando productos"}
        </td>
      </tr>
    );
  }

  if (productos.length === 0) {
    return (
      <tr>
        <td colSpan={10} className="text-center py-12 text-[#6b7a8f]">
          Sin Productos
        </td>
      </tr>
    );
  }

  return productos.map((product) => {
    const totalStock = product.inventarios.reduce(
      (acc, inventario) => acc + inventario.stockActual,
      0,
    );
    const isLowStock = totalStock <= product.stockMinimo;

    return (
      <tr key={product.id} className="border-b border-[#9adce2] last:border-b-0">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-[#e8f4f6] text-[#0aa6a2]">
              {getProductImageUrl(product.imagenPath) ? (
                <img
                  src={getProductImageUrl(product.imagenPath) ?? undefined}
                  alt={product.nombre}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <FontAwesomeIcon icon={faBoxOpen} className="text-lg" />
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
          <span className={isLowStock ? "font-semibold text-[#c2410c]" : ""}>
            {`${totalStock} ${product.unidadMedida}`}
          </span>
        </td>
        <td className="px-4 py-4 text-center text-sm md:text-base">
          <span
            className={`inline-flex rounded-full px-3 py-1 font-semibold ${
              isLowStock
                ? "bg-[#fff1e6] text-[#c2410c]"
                : "bg-[#e6f8f1] text-[#117a4d]"
            }`}
          >
            {product.stockMinimo}
          </span>
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
                    ? () => inactiveProduct(product.id)
                    : () => activeProduct(product.id)
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
                  navigate(`/Product-Management/Update-Product/${product.id}`)
                }
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  });
}
