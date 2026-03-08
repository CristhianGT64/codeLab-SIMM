import { useNavigate, useParams } from "react-router";
import {
  useRef,
  useState,
  useEffect,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import {
  HeaderActualizarProducto,
  HeaderNuevoProducto,
  InformacionImportanteProducto,
  InitialProductForm,
} from "../../../data/dataAdministrator/ProductManagment";
import InfImportante from "../../../components/informacionImportante/InfImportante";
import type { FormProducts } from "../../../interfaces/Products/FormProducts";
import useListUnidadesProducto from "../../../hooks/ProductosHooks/useUnidadesProducto";
import useListCategoriaProducto from "../../../hooks/ProductosHooks/useCategoriaProducto";
import useListSucursales from "../../../hooks/SucursalesHooks/useListSucursales";
import useCreateProducto from "../../../hooks/ProductosHooks/useCreateProducto";
import useProductById from "../../../hooks/ProductosHooks/useReadProductById";
import settings from "../../../lib/settings";
import useUpdateProduct from "../../../hooks/ProductosHooks/useUpdateProducto";
import StatusNotification from "../../../components/notifications/StatusNotification";

type NotificationState = {
  isVisible: boolean;
  variant: "success" | "error";
  title: string;
  message: string;
};

export default function FormProduct() {
  const navigate = useNavigate();
  const { id } = useParams<{
    id: string;
  }>(); /* Obtiene directamente el id del producto de la URL */
  const isEditMode = Boolean(id);
  const [form, setForm] = useState<FormProducts>(InitialProductForm);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    variant: "success",
    title: "",
    message: "",
  });
  const { data: unidadesData } = useListUnidadesProducto();
  const { data: categoriaData } = useListCategoriaProducto();
  const { data: sucursalesData } = useListSucursales();
  const {
    mutateAsync: createProductMutation,
    isPending: isCreating,
  } = useCreateProducto();
  const {
    mutateAsync: updateProductMutation,
    isPending: isUpdating,
  } = useUpdateProduct();
  const unidadesProduct = unidadesData?.data ?? [];
  const categoriaProduct = categoriaData?.data ?? [];
  const sucursales = sucursalesData?.data ?? [];
  const isPending = isCreating || isUpdating;
  const {
    data: ProductData,
    isLoading: isLoadingUser,
    isError: isUserError,
    error: userError,
  } = useProductById(id ?? "");

  useEffect(() => {
    if (!isEditMode) {
      setForm(InitialProductForm);
      return;
    }

    if (ProductData?.data) {
      const imagePath = ProductData.data.imagenPath;
      if (imagePath) {
        const baseUrl = settings.URL.replace(/\/$/, "");
        const normalizedPath = imagePath.startsWith("/")
          ? imagePath
          : `/${imagePath}`;
        setImagePreview(`${baseUrl}${normalizedPath}`);
      } else {
        setImagePreview(null);
      }

      setForm({
        nombre: ProductData?.data.nombre,
        sku: ProductData?.data.sku,
        categoriaId: ProductData?.data.categoria.id.toString(),
        costo: ProductData?.data.costo.toString(),
        precioVenta: ProductData?.data.precioVenta,
        unidadMedida: ProductData?.data.unidadMedida,
        stockInicial: ProductData?.data.inventarios[0].stockActual,
        sucursalId: ProductData?.data.inventarios[0].sucursalId,
        imagen: null,
      });
    }
  }, [isEditMode, ProductData]);

  const goBack = () => {
    navigate("/Product-Management");
  };

  const onChangeField =
    (field: keyof FormProducts) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, imagen: file }));
  };

  const onSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const wasProcessed =
        isEditMode && id
          ? await updateProductMutation({ id, credentials: form })
          : await createProductMutation(form);

      if (wasProcessed) {
        setNotification({
          isVisible: true,
          variant: "success",
          title: isEditMode ? "Producto actualizado" : "Producto creado",
          message: isEditMode
            ? "Los cambios del producto se guardaron correctamente."
            : "El producto se creo correctamente.",
        });

        globalThis.setTimeout(() => {
          navigate("/Product-Management");
        }, 1300);
      } else {
        setNotification({
          isVisible: true,
          variant: "error",
          title: isEditMode
            ? "No se pudo actualizar"
            : "No se pudo crear el producto",
          message:
            "La operacion no pudo completarse. Intenta de nuevo en unos segundos.",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "La operacion fallo por un error inesperado.";

      setNotification({
        isVisible: true,
        variant: "error",
        title: isEditMode
          ? "Error al actualizar producto"
          : "Error al crear producto",
        message: errorMessage,
      });
    }
  };

  return (
    <section className="w-full px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-220">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-2 text-base font-semibold text-[#0aa6a2] hover:text-[#06706d]"
          onClick={goBack}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
          <span className="text-[32px] leading-none">Volver al listado</span>
        </button>

        <HeaderTitleAdmin
          {...(isEditMode ? HeaderActualizarProducto : HeaderNuevoProducto)}
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

        {isEditMode && isLoadingUser && (
          <p className="mt-4 text-base font-semibold text-[#4661b0]">
            Cargando información del producto...
          </p>
        )}

        {isEditMode && isUserError && (
          <p className="mt-4 text-base font-semibold text-[#c20000]">
            {userError instanceof Error
              ? userError.message
              : "No se pudo cargar el producto"}
          </p>
        )}

        <form
          className="mt-8 rounded-2xl bg-[#f4f6f8] p-6 shadow-[0_6px_16px_rgba(0,0,0,0.1)] md:p-8"
          onSubmit={onSubmit}
        >
          {/* Imagen del producto */}
          <div className="mb-6">
            <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
              Imagen del Producto (Opcional)
            </p>
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#9adce2] bg-white">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faCloudArrowUp}
                    className="text-3xl text-[#9adce2]"
                  />
                )}
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#0aa6a2] px-4 py-2 text-base font-semibold text-white hover:bg-[#06706d]"
                >
                  <FontAwesomeIcon icon={faCloudArrowUp} />
                  Cargar Imagen
                </button>
                <p className="mt-1 text-sm text-[#6a758f]">
                  JPG, PNG o GIF. Máximo 5MB.
                </p>
                {imageFile && (
                  <p className="mt-1 text-sm font-medium text-[#0aa6a2]">
                    {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Nombre del producto - full width */}
            <div className="md:col-span-2">
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Nombre del Producto <span className="text-[#ff4f4f]">*</span>
              </p>
              <input
                id="nombreProducto"
                type="text"
                value={form.nombre}
                onChange={onChangeField("nombre")}
                placeholder="Ej: Laptop Dell Inspiron 15"
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            {/* Código SKU */}
            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Código SKU <span className="text-[#ff4f4f]">*</span>
              </p>
              <input
                value={form.sku}
                onChange={onChangeField("sku")}
                id="sku"
                type="text"
                disabled={isEditMode}
                placeholder="TECH-LAP-001"
                className={`h-14 w-full rounded-2xl border-2 ${isEditMode ? " border-[#839496] bg-[#949a9b]" : " border-[#9adce2] bg-white"} px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]`}
              />
            </div>

            {/* Categoría */}
            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Categoría <span className="text-[#ff4f4f]">*</span>
              </p>
              <select
                value={form.categoriaId}
                onChange={onChangeField("categoriaId")}
                id="categoria"
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#111111] outline-none focus:border-[#0aa6a2]"
                required
              >
                <option value="">Seleccionar categoría</option>

                {categoriaProduct.map((categoria) => (
                  <option
                    key={`${categoria.id}-${categoria.nombre}`}
                    value={categoria.id}
                  >
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fila de Costo, Precio de Venta y Margen */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Costo del Producto */}
            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Costo del Producto <span className="text-[#ff4f4f]">*</span>
              </p>
              <div className="relative">
                <span className="absolute top-1/2 left-5 -translate-y-1/2 text-xl font-semibold text-[#6a758f]">
                  L
                </span>
                <input
                  value={form.costo}
                  onChange={onChangeField("costo")}
                  id="costo"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white pl-10 pr-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
                />
              </div>
            </div>

            {/* Precio de Venta */}
            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Precio de Venta <span className="text-[#ff4f4f]">*</span>
              </p>
              <div className="relative">
                <span className="absolute top-1/2 left-5 -translate-y-1/2 text-xl font-semibold text-[#6a758f]">
                  L
                </span>
                <input
                  value={form.precioVenta}
                  onChange={onChangeField("precioVenta")}
                  id="precioVenta"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white pl-10 pr-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
                />
              </div>
            </div>

            {/* Margen de Ganancia (solo lectura) */}
            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Margen de Ganancia
              </p>
              <div className="flex h-14 items-center rounded-2xl border-2 border-[#9adce2] bg-[#e8f3f5] px-5">
                <span className="text-xl font-bold text-[#0aa6a2]">{`${(((form.precioVenta - Number(form.costo)) / form.precioVenta) * 100).toFixed(2)} %`}</span>
              </div>
            </div>
          </div>

          {/* Unidad de Medida y Stock Inicial */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Unidad de Medida <span className="text-[#ff4f4f]">*</span>
              </p>
              <select
                id="unidadMedida"
                value={form.unidadMedida}
                onChange={onChangeField("unidadMedida")}
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#111111] outline-none focus:border-[#0aa6a2]"
                required
              >
                <option value="">Elija una unidad</option>
                {unidadesProduct.map((unidad) => (
                  <option key={unidad} value={unidad}>
                    {unidad}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Sucursal asignada <span className="text-[#ff4f4f]">*</span>
              </p>
              <select
                id="sucursal"
                aria-label="Sucursal Asignada"
                value={form.sucursalId}
                onChange={onChangeField("sucursalId")}
                required
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#111111] outline-none focus:border-[#0aa6a2]"
              >
                <option value="">Seleccionar sucursal</option>
                {sucursales.map((sucursal) => (
                  <option key={sucursal.id} value={sucursal.id}>
                    {sucursal.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Stock Inicial <span className="text-[#ff4f4f]">*</span>
              </p>
              <input
                value={form.stockInicial}
                onChange={onChangeField("stockInicial")}
                disabled={isEditMode}
                id="stockInicial"
                type="number"
                min="0"
                placeholder="0"
                className={`h-14 w-full rounded-2xl border-2 ${isEditMode ? " border-[#839496] bg-[#949a9b]" : " border-[#9adce2] bg-white"} px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]`}
              />
            </div>
          </div>

          {/* Información importante */}
          <InfImportante {...InformacionImportanteProducto} />

          {/* Botones de acción */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <ButtonsComponet
              typeButton="button"
              onClick={() => goBack()}
              disabled={false}
              className="h-14 cursor-pointer rounded-2xl border-2 border-[#9adce2] bg-white text-2xl font-semibold text-[#4661b0] hover:bg-[#edf8fa]"
              text="Cancelar"
              icon="fa-solid fa-arrow-left"
            />

            {isEditMode ? (
              <ButtonsComponet
                typeButton="submit"
                onClick={() => {}}
                disabled={false}
                className="inline-flex h-14 cursor-pointer items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-2xl font-bold text-white hover:from-[#06706d] hover:to-[#334c8b] disabled:cursor-not-allowed disabled:opacity-70"
                text={isPending ? "Actualizando..." : "Actualizar Producto"}
                icon="fa-solid fa-floppy-disk"
              />
            ) : (
              <ButtonsComponet
                typeButton="submit"
                onClick={() => {}}
                disabled={false}
                className="inline-flex h-14 cursor-pointer items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-2xl font-bold text-white hover:from-[#06706d] hover:to-[#334c8b] disabled:cursor-not-allowed disabled:opacity-70"
                text={isPending ? "Creando..." : "Crear Producto"}
                icon="fa-solid fa-floppy-disk"
              />
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
