import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import useProductosBajoStock from "../../../hooks/InventarioHooks/useProductosBajoStock";
import useAlertasInventario from "../../../hooks/InventarioHooks/useAlertasInventario";
import useUpdateStockMinimo from "../../../hooks/ProductosHooks/useUpdateStockMinimo";
import useAuth from "../../../hooks/useAuth";
import TableComponent from "../../../components/Table/TableComponent";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";
import StatusNotification from "../../../components/notifications/StatusNotification";
import PaginacionComponent from "../../../components/Paginacion/PaginacionComponent";

const ITEMS_POR_PAGINA = 8;

const headers = [
  "Producto",
  "SKU",
  "Stock Actual",
  "Stock Mínimo",
  "Sucursal",
  "Alerta",
  "Acción",
];

type NotificationState = {
  isVisible: boolean;
  variant: "success" | "error";
  title: string;
  message: string;
};

export default function ProductosBajoStock() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const sucursalId = user?.sucursal.id;
  const { data: bajoStockData, isLoading } = useProductosBajoStock(sucursalId);
  const { data: alertasData } = useAlertasInventario(sucursalId);
  const { mutateAsync: updateStockMinimo, isPending } = useUpdateStockMinimo();

  const [paginaActual, setPaginaActual] = useState(1);
  const [stockMinimos, setStockMinimos] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    variant: "success",
    title: "",
    message: "",
  });

  const productosBajoStock = bajoStockData?.data ?? [];
  const alertas = alertasData?.data ?? [];

  useEffect(() => {
    if (productosBajoStock.length === 0) {
      return;
    }

    setStockMinimos((prev) => {
      const next = { ...prev };

      productosBajoStock.forEach((item) => {
        if (next[item.productoId] === undefined) {
          next[item.productoId] = String(item.stockMinimo);
        }
      });

      return next;
    });
  }, [productosBajoStock]);

  const alertasPorProducto = useMemo(() => {
    const map = new Map<string, string>();

    alertas.forEach((alerta) => {
      if (!map.has(alerta.productoId)) {
        map.set(alerta.productoId, alerta.mensaje);
      }
    });

    return map;
  }, [alertas]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(productosBajoStock.length / ITEMS_POR_PAGINA),
  );
  const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const fin = inicio + ITEMS_POR_PAGINA;
  const itemsPaginados = productosBajoStock.slice(inicio, fin);

  const handleGuardar = async (productoId: string, nombreProducto: string) => {
    const value = Number(stockMinimos[productoId] ?? "0");

    if (!Number.isInteger(value) || value < 0) {
      setNotification({
        isVisible: true,
        variant: "error",
        title: "Valor inválido",
        message: "El stock mínimo debe ser un número entero mayor o igual a 0.",
      });
      return;
    }

    try {
      await updateStockMinimo({
        id: productoId,
        stockMinimo: value,
      });

      setNotification({
        isVisible: true,
        variant: "success",
        title: "Stock mínimo actualizado",
        message: `Se actualizó el stock mínimo de "${nombreProducto}".`,
      });
    } catch (error) {
      setNotification({
        isVisible: true,
        variant: "error",
        title: "No se pudo actualizar",
        message:
          error instanceof Error
            ? error.message
            : "No fue posible guardar el nuevo stock mínimo.",
      });
    }
  };

  const contenidoTabla = (() => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={7} className="py-12 text-center text-[#6b7a8f]">
            Cargando productos con bajo inventario...
          </td>
        </tr>
      );
    }

    if (itemsPaginados.length === 0) {
      return (
        <tr>
          <td colSpan={7} className="py-12 text-center text-[#6b7a8f]">
            No hay productos por debajo del stock mínimo en esta sucursal.
          </td>
        </tr>
      );
    }

    return itemsPaginados.map((item) => (
      <tr key={item.inventarioId} className="border-b border-[#e5edf5]">
        <td className="px-6 py-4">
          <p className="font-semibold text-[#24364d]">{item.producto.nombre}</p>
        </td>
        <td className="px-6 py-4 text-sm text-[#6b7a8f]">{item.producto.sku}</td>
        <td className="px-6 py-4">
          <span className="inline-flex rounded-full bg-[#fff1e6] px-3 py-1 text-sm font-semibold text-[#c2410c]">
            {item.stockActual}
          </span>
        </td>
        <td className="px-6 py-4">
          <input
            type="number"
            min="0"
            value={stockMinimos[item.productoId] ?? item.stockMinimo}
            onChange={(event) =>
              setStockMinimos((prev) => ({
                ...prev,
                [item.productoId]: event.target.value,
              }))
            }
            className="h-10 w-24 rounded-lg border border-[#9adce2] px-3 text-sm text-[#24364d] outline-none focus:border-[#0aa6a2]"
          />
        </td>
        <td className="px-6 py-4 text-sm text-[#4661b0]">{item.sucursal.nombre}</td>
        <td className="px-6 py-4 text-sm text-[#8b5e1a]">
          {alertasPorProducto.get(item.productoId) ?? "Stock bajo"}
        </td>
        <td className="px-6 py-4">
          <ButtonsComponet
            text={isPending ? "Guardando..." : "Guardar"}
            typeButton="button"
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#0aa6a2] to-[#4661b0] px-4 text-sm font-semibold text-white hover:from-[#06706d] hover:to-[#334c8b] disabled:cursor-not-allowed disabled:opacity-70"
            icon="fa-solid fa-floppy-disk"
            onClick={() => handleGuardar(item.productoId, item.producto.nombre)}
            disabled={isPending}
          />
        </td>
      </tr>
    ));
  })();

  return (
    <section className="px-6 py-8">
      <HeaderTitleAdmin
        title="Productos con Bajo Inventario"
        subTitle="Consulta los productos cuyo stock actual ya alcanzó el mínimo configurado"
      />

      <StatusNotification
        isVisible={notification.isVisible}
        variant={notification.variant}
        title={notification.title}
        message={notification.message}
        onClose={() =>
          setNotification((prev) => ({ ...prev, isVisible: false }))
        }
      />

      <div className="mt-6 flex flex-col gap-4 md:flex-row">
        <div className="flex-1 rounded-2xl border border-[#f2d59b] bg-[#fff8e8] p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#a15c00]">
            Resumen
          </p>
          <h3 className="mt-2 text-3xl font-bold text-[#6c3f00]">
            {productosBajoStock.length}
          </h3>
          <p className="mt-2 text-sm text-[#8b5e1a]">
            producto{productosBajoStock.length === 1 ? "" : "s"} bajo alerta en la sucursal actual.
          </p>
        </div>

        <ButtonsComponet
          text="Volver a inventario"
          typeButton="button"
          className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#9adce2] bg-white px-5 text-sm font-semibold text-[#4661b0] hover:bg-[#edf8fa]"
          icon="fa-solid fa-arrow-left"
          onClick={() => navigate("/Inventario-Management")}
          disabled={false}
        />
      </div>

      <div className="mt-6">
        <TableComponent
          tituloTablaInventario={headers}
          contenidoTabla={contenidoTabla}
        />
      </div>

      <PaginacionComponent
        inicio={inicio}
        fin={fin}
        registros={productosBajoStock}
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        action={(pagina: number) => setPaginaActual(pagina)}
      />
    </section>
  );
}
