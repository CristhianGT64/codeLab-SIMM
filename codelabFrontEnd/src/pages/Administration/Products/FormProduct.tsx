import { useNavigate, useParams } from "react-router";
import { useState, useEffect, type ChangeEvent, type SyntheticEvent } from "react";
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

export default function FormProduct() {
  const navigate = useNavigate();
  const { id } = useParams<{
    id: string;
  }>(); /* Obtiene directamente el id del producto de la URL */
  const isEditMode = Boolean(id);
  const [form, setForm] = useState<FormProducts>(InitialProductForm);
  const goBack = () => {
    navigate("/Product-Management");
  };

  const onChangeField =
    (field: keyof FormProducts) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

      const onSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(form);
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

        <form className="mt-8 rounded-2xl bg-[#f4f6f8] p-6 shadow-[0_6px_16px_rgba(0,0,0,0.1)] md:p-8"
            onSubmit={onSubmit}
        >
          {/* Imagen del producto */}
          <div className="mb-6">
            <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
              Imagen del Producto (Opcional)
            </p>
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-[#9adce2] bg-white">
                <FontAwesomeIcon
                  icon={faCloudArrowUp}
                  className="text-3xl text-[#9adce2]"
                />
              </div>
              <div>
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#0aa6a2] px-4 py-2 text-base font-semibold text-white hover:bg-[#06706d]"
                >
                  <FontAwesomeIcon icon={faCloudArrowUp} />
                  Cargar Imagen
                </button>
                <p className="mt-1 text-sm text-[#6a758f]">
                  JPG, PNG o GIF. Máximo 5MB.
                </p>
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
                id="nameProduct"
                type="text"
                onChange={onChangeField("nameProduct")}
                value={form.nameProduct}
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
                placeholder="TECH-LAP-001"
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
              />
            </div>

            {/* Categoría */}
            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Categoría <span className="text-[#ff4f4f]">*</span>
              </p>
              <select
                value={form.categorie}
                onChange={onChangeField("categorie")}
                id="categoria"
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#111111] outline-none focus:border-[#0aa6a2]"
              >
                <option value="">Seleccionar categoría</option>
                <option value="tecnologia">Tecnología</option>
                <option value="muebles">Muebles</option>
                <option value="papeleria">Papelería</option>
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
                  value={form.productCost}
                  onChange={onChangeField("productCost")}
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
                  value={form.priceSale}
                  onChange={onChangeField("priceSale")}
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
                <span className="text-xl font-bold text-[#0aa6a2]">0.0%</span>
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
                value={form.unit}
                onChange={onChangeField("unit")}
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#111111] outline-none focus:border-[#0aa6a2]"
              >
                <option value="unidad">Unidad</option>
                <option value="caja">Caja</option>
                <option value="paquete">Paquete</option>
                <option value="kilogramo">Kilogramo</option>
                <option value="litro">Litro</option>
              </select>
            </div>

            <div>
              <p className="mb-2 block text-xl font-semibold text-[#0a4d76]">
                Stock Inicial <span className="text-[#ff4f4f]">*</span>
              </p>
              <input
                value={form.stockInit}
                onChange={onChangeField("stockInit")}
                id="stockInicial"
                type="number"
                min="0"
                placeholder="0"
                className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none placeholder:text-[#97a0b7] focus:border-[#0aa6a2]"
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
                text="Actualizar Producto"
                icon="fa-solid fa-floppy-disk"
              />
            ) : (
              <ButtonsComponet
                typeButton="submit"
                onClick={() => {}}
                disabled={false}
                className="inline-flex h-14 cursor-pointer items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-2xl font-bold text-white hover:from-[#06706d] hover:to-[#334c8b] disabled:cursor-not-allowed disabled:opacity-70"
                text="Crear Producto"
                icon="fa-solid fa-floppy-disk"
              />
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
