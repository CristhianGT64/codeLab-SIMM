import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import useAuth from "../../../hooks/useAuth";
import useCatalogoContableArbol from "../../../hooks/CatalogoCuentasContablesHooks/useCatalogoContableArbol";
import useCatalogoContableResumen from "../../../hooks/CatalogoCuentasContablesHooks/useCatalogoContableResumen";
import useNaturalezasContables from "../../../hooks/CatalogoCuentasContablesHooks/useNaturalezasContables";
import useCreateElementoContable from "../../../hooks/CatalogoCuentasContablesHooks/useCreateElementoContable";
import useUpdateElementoContable from "../../../hooks/CatalogoCuentasContablesHooks/useUpdateElementoContable";
import useChangeElementoContableStatus from "../../../hooks/CatalogoCuentasContablesHooks/useChangeElementoContableStatus";
import useCreateClasificacionContable from "../../../hooks/CatalogoCuentasContablesHooks/useCreateClasificacionContable";
import useUpdateClasificacionContable from "../../../hooks/CatalogoCuentasContablesHooks/useUpdateClasificacionContable";
import useChangeClasificacionContableStatus from "../../../hooks/CatalogoCuentasContablesHooks/useChangeClasificacionContableStatus";
import useCreateCuentaContable from "../../../hooks/CatalogoCuentasContablesHooks/useCreateCuentaContable";
import useUpdateCuentaContable from "../../../hooks/CatalogoCuentasContablesHooks/useUpdateCuentaContable";
import useChangeCuentaContableStatus from "../../../hooks/CatalogoCuentasContablesHooks/useChangeCuentaContableStatus";
import useCreateSubCuentaContable from "../../../hooks/CatalogoCuentasContablesHooks/useCreateSubCuentaContable";
import useUpdateSubCuentaContable from "../../../hooks/CatalogoCuentasContablesHooks/useUpdateSubCuentaContable";
import useChangeSubCuentaContableStatus from "../../../hooks/CatalogoCuentasContablesHooks/useChangeSubCuentaContableStatus";
import type {
  CatalogoFormState,
  ElementoContable,
  NivelCatalogoContable,
} from "../../../interfaces/CatalogoCuentasContables/CatalogoCuentasContables";
import CardTotalComponent from "../../../components/cardTotalComponent/CardTotalComponent";
import CatalogoTree from "../../../components/CatalogoCuentasContables/CatalogoTree";
import CatalogoCuentaModal from "../../../components/CatalogoCuentasContables/CatalogoCuentaModal";

type EstadoFiltro = "todos" | "activos" | "inactivos";

const initialFormState: CatalogoFormState = {
  nivel: "elemento",
  nombre: "",
  idNaturaleza: "",
  uuidElementoContable: "",
  uuidClasificacionContable: "",
  uuidCuentaContable: "",
  disponible: true,
};

const filterTree = (
  elementos: ElementoContable[],
  search: string,
  estadoFiltro: EstadoFiltro,
  naturalezaFiltro: string,
) => {
  const term = search.trim().toLowerCase();

  const matchesEstado = (disponible: boolean) => {
    if (estadoFiltro === "activos") {
      return disponible;
    }

    if (estadoFiltro === "inactivos") {
      return !disponible;
    }

    return true;
  };

  const matchesNaturaleza = (idNaturaleza?: string) => {
    if (!naturalezaFiltro) return true;
    return idNaturaleza === naturalezaFiltro;
  };

  const matchesText = (nombre: string, codigoNumerico: number) => {
    if (!term) {
      return true;
    }

    return (
      nombre.toLowerCase().includes(term) ||
      String(codigoNumerico).includes(term)
    );
  };

  return elementos
    .filter((elemento) => matchesNaturaleza(elemento.idNaturaleza))
    .map((elemento) => {
      const clasificaciones = (elemento.clasificaciones ?? [])
        .map((clasificacion) => {
          const cuentas = (clasificacion.cuentas ?? [])
            .map((cuenta) => {
              const subcuentas = (cuenta.subcuentas ?? []).filter(
                (subcuenta) =>
                  matchesEstado(subcuenta.disponible) &&
                  matchesText(subcuenta.nombre, subcuenta.codigoNumerico),
              );

              const includeCuenta =
                (matchesEstado(cuenta.disponible) &&
                  matchesText(cuenta.nombre, cuenta.codigoNumerico)) ||
                subcuentas.length > 0;

              if (!includeCuenta) {
                return null;
              }

              return {
                ...cuenta,
                subcuentas,
              };
            })
            .filter(Boolean);

          const includeClasificacion =
            (matchesEstado(clasificacion.disponible) &&
              matchesText(clasificacion.nombre, clasificacion.codigoNumerico)) ||
            cuentas.length > 0;

          if (!includeClasificacion) {
            return null;
          }

          return {
            ...clasificacion,
            cuentas,
          };
        })
        .filter(Boolean);

      const includeElemento =
        (matchesEstado(elemento.disponible) &&
          matchesText(elemento.nombre, elemento.codigoNumerico)) ||
        clasificaciones.length > 0;

      if (!includeElemento) {
        return null;
      }

      return {
        ...elemento,
        clasificaciones,
      };
    })
    .filter(Boolean) as ElementoContable[];
};

export default function CatalogoCuentasContablesManagement() {
  const { tienePermiso } = useAuth();
  const catalogoQuery = useCatalogoContableArbol();
  const resumenQuery = useCatalogoContableResumen();
  const naturalezasQuery = useNaturalezasContables();

  const createElemento = useCreateElementoContable();
  const updateElemento = useUpdateElementoContable();
  const changeElementoStatus = useChangeElementoContableStatus();
  const createClasificacion = useCreateClasificacionContable();
  const updateClasificacion = useUpdateClasificacionContable();
  const changeClasificacionStatus = useChangeClasificacionContableStatus();
  const createCuenta = useCreateCuentaContable();
  const updateCuenta = useUpdateCuentaContable();
  const changeCuentaStatus = useChangeCuentaContableStatus();
  const createSubCuenta = useCreateSubCuentaContable();
  const updateSubCuenta = useUpdateSubCuentaContable();
  const changeSubCuentaStatus = useChangeSubCuentaContableStatus();

  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoFiltro>("todos");
  const [naturalezaFiltro, setNaturalezaFiltro] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formState, setFormState] = useState<CatalogoFormState>(initialFormState);

  const arbol = Array.isArray(catalogoQuery.data?.data)
    ? catalogoQuery.data.data
    : [];
  const resumen = resumenQuery.data?.data;
  const naturalezas = Array.isArray(naturalezasQuery.data?.data)
    ? naturalezasQuery.data.data
    : [];

  const filteredTree = useMemo(
    () =>
      filterTree(
        Array.isArray(catalogoQuery.data?.data) ? catalogoQuery.data.data : [],
        search,
        estadoFiltro,
        naturalezaFiltro,
      ),
    [catalogoQuery.data, estadoFiltro, naturalezaFiltro, search],
  );

  const openCreateModal = (nivel: NivelCatalogoContable = "elemento") => {
    setFormState({
      ...initialFormState,
      nivel,
      idNaturaleza: naturalezas[0]?.id ?? "",
    });
    setModalOpen(true);
  };

  const openEditModal = (nextState: CatalogoFormState) => {
    setFormState(nextState);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormState(initialFormState);
  };

  const handleSubmit = async (payload: CatalogoFormState) => {
    try {
      if (payload.nivel === "elemento") {
        if (payload.id) {
          const response = await updateElemento.mutateAsync({
            id: payload.id,
            nombre: payload.nombre,
            idNaturaleza: payload.idNaturaleza,
            disponible: payload.disponible,
          });
          toast.success(response.message || "Elemento contable actualizado correctamente.");
        } else {
          const response = await createElemento.mutateAsync({
            nombre: payload.nombre,
            idNaturaleza: payload.idNaturaleza,
            disponible: payload.disponible,
          });
          toast.success(response.message || "Elemento contable creado correctamente.");
        }
      }

      if (payload.nivel === "clasificacion") {
        if (payload.id) {
          const response = await updateClasificacion.mutateAsync({
            id: payload.id,
            nombre: payload.nombre,
            disponible: payload.disponible,
          });
          toast.success(response.message || "Clasificación contable actualizada correctamente.");
        } else {
          const response = await createClasificacion.mutateAsync({
            nombre: payload.nombre,
            uuidElementoContable: payload.uuidElementoContable,
            disponible: payload.disponible,
          });
          toast.success(response.message || "Clasificación contable creada correctamente.");
        }
      }

      if (payload.nivel === "cuenta") {
        if (payload.id) {
          const response = await updateCuenta.mutateAsync({
            id: payload.id,
            nombre: payload.nombre,
            idNaturaleza: payload.idNaturaleza,
            disponible: payload.disponible,
          });
          toast.success(response.message || "Cuenta contable actualizada correctamente.");
        } else {
          const response = await createCuenta.mutateAsync({
            nombre: payload.nombre,
            uuidElementoContable: payload.uuidElementoContable,
            uuidClasificacionContable: payload.uuidClasificacionContable,
            idNaturaleza: payload.idNaturaleza,
            disponible: payload.disponible,
          });
          toast.success(response.message || "Cuenta contable creada correctamente.");
        }
      }

      if (payload.nivel === "subcuenta") {
        if (payload.id) {
          const response = await updateSubCuenta.mutateAsync({
            id: payload.id,
            nombre: payload.nombre,
            idNaturaleza: payload.idNaturaleza,
            disponible: payload.disponible,
          });
          toast.success(response.message || "Subcuenta contable actualizada correctamente.");
        } else {
          const response = await createSubCuenta.mutateAsync({
            nombre: payload.nombre,
            uuidElementoContable: payload.uuidElementoContable,
            uuidClasificacionContable: payload.uuidClasificacionContable,
            uuidCuentaContable: payload.uuidCuentaContable,
            idNaturaleza: payload.idNaturaleza,
            disponible: payload.disponible,
          });
          toast.success(response.message || "Subcuenta contable creada correctamente.");
        }
      }

      closeModal();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo guardar la información del catálogo.";

      toast.error(message.includes("duplic") ? "Código de cuenta duplicado." : message);
    }
  };

  const handleToggleStatus = async (nivel: NivelCatalogoContable, id: string, disponible: boolean) => {
    try {
      if (nivel === "elemento") {
        const response = await changeElementoStatus.mutateAsync({ id, disponible: !disponible });
        toast.success(response.message || "Estado actualizado correctamente.");
      }

      if (nivel === "clasificacion") {
        const response = await changeClasificacionStatus.mutateAsync({ id, disponible: !disponible });
        toast.success(response.message || "Estado actualizado correctamente.");
      }

      if (nivel === "cuenta") {
        const response = await changeCuentaStatus.mutateAsync({ id, disponible: !disponible });
        toast.success(response.message || "Estado actualizado correctamente.");
      }

      if (nivel === "subcuenta") {
        const response = await changeSubCuentaStatus.mutateAsync({ id, disponible: !disponible });
        toast.success(response.message || "Estado actualizado correctamente.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo actualizar el estado.",
      );
    }
  };

  return (
    <section className="w-full px-4 py-5 md:px-6 bg-[#f3f5f8]">
      <header>
        <h2 className="text-3xl font-bold text-[#0b4d77] md:text-4xl">
          Catálogo de Cuentas Contables
        </h2>
        <p className="mt-1 text-lg text-[#4661b0] md:text-xl">
          Gestiona el catálogo jerárquico de cuentas contables
        </p>
      </header>

      <div className="mt-6 rounded-2xl bg-[#f3f5f8] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <label className="flex h-11 w-full items-center gap-3 rounded-xl border-2 border-[#9adce2] bg-white px-4 md:max-w-sm">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-lg text-[#9adce2]" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por código o nombre..."
              className="w-full bg-transparent text-base text-[#6a758f] placeholder:text-[#8891a7] outline-none md:text-lg"
            />
          </label>

          <div className="flex items-center gap-3">
            <select
              value={naturalezaFiltro}
              onChange={(event) => setNaturalezaFiltro(event.target.value)}
              className="h-11 rounded-xl border-2 border-[#9adce2] bg-white px-4 text-base text-[#6a758f] outline-none md:text-lg"
            >
              <option value="">Todos los elementos</option>
              {naturalezas.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.nombre}
                </option>
              ))}
            </select>

            <select
              value={estadoFiltro}
              onChange={(event) => setEstadoFiltro(event.target.value as EstadoFiltro)}
              className="h-11 rounded-xl border-2 border-[#9adce2] bg-white px-4 text-base text-[#6a758f] outline-none md:text-lg"
            >
              <option value="todos">Todos los estados</option>
              <option value="activos">Activas</option>
              <option value="inactivos">Inactivas</option>
            </select>

            {tienePermiso("Crear cuentas contables") && (
              <button
                type="button"
                onClick={() => openCreateModal("elemento")}
                className="cursor-pointer flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] hover:from-[#034d4a] hover:to-[#2c3d70] px-6 text-base font-semibold text-white md:text-lg"
              >
                <FontAwesomeIcon icon={faPlus} />
                Nuevo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="mt-6 grid gap-4 md:grid-cols-4 mb-6">
        <CardTotalComponent
          title="Elementos"
          total={resumen?.totalElementos ?? 0}
          colorNumber="text-[#2f67ff]"
        />
        <CardTotalComponent
          title="Clasificaciones"
          total={resumen?.totalClasificaciones ?? 0}
          colorNumber="text-[#7b21d8]"
        />
        <CardTotalComponent
          title="Cuentas"
          total={resumen?.totalCuentas ?? 0}
          colorNumber="text-[#c85b00]"
        />
        <CardTotalComponent
          title="Sub-Cuentas"
          total={resumen?.totalSubcuentas ?? 0}
          colorNumber="text-[#008d42]"
        />
      </div>

      {/* Árbol jerárquico */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
        <div className="border-b border-[#d9e3ef] px-6 py-4">
          <h3 className="text-xl font-bold text-[#0b4d77] md:text-2xl">
            Estructura Jerárquica del Catálogo
          </h3>
        </div>

        <div className="px-4 py-4 md:px-6">
          <CatalogoTree
            data={filteredTree}
            isLoading={catalogoQuery.isLoading}
            isError={catalogoQuery.isError}
            error={catalogoQuery.error}
            canEdit={tienePermiso("Editar cuentas contables")}
            canCreate={tienePermiso("Crear cuentas contables")}
            onCreate={openEditModal}
            onEdit={openEditModal}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </div>

      <CatalogoCuentaModal
        isOpen={modalOpen}
        formState={formState}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onChange={setFormState}
        naturalezas={naturalezas}
        tree={arbol}
        isSubmitting={
          createElemento.isPending ||
          updateElemento.isPending ||
          createClasificacion.isPending ||
          updateClasificacion.isPending ||
          createCuenta.isPending ||
          updateCuenta.isPending ||
          createSubCuenta.isPending ||
          updateSubCuenta.isPending
        }
      />
    </section>
  );
}
