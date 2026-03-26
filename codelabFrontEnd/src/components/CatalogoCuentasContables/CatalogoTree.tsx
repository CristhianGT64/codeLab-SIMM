import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
  faPenToSquare,
  faPlus,
  faToggleOff,
  faToggleOn,
  faSpinner,
  faTriangleExclamation,
  faFolderOpen,
  faFolder,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";
import type {
  CatalogoFormState,
  ElementoContable,
  NivelCatalogoContable,
} from "../../interfaces/CatalogoCuentasContables/CatalogoCuentasContables";

interface CatalogoTreeProps {
  data: ElementoContable[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  canEdit: boolean;
  canCreate: boolean;
  onCreate: (state: CatalogoFormState) => void;
  onEdit: (state: CatalogoFormState) => void;
  onToggleStatus: (nivel: NivelCatalogoContable, id: string, disponible: boolean) => void;
}

const levelColors = {
  elemento: {
    bg: "bg-[#eaf1ff]",
    border: "border-[#2f67ff]",
    text: "text-[#2f67ff]",
    icon: "text-[#2f67ff]",
  },
  clasificacion: {
    bg: "bg-[#f4ecff]",
    border: "border-[#9f3dff]",
    text: "text-[#7b21d8]",
    icon: "text-[#9f3dff]",
  },
  cuenta: {
    bg: "bg-[#fff8e7]",
    border: "border-[#ff9100]",
    text: "text-[#c85b00]",
    icon: "text-[#ff9100]",
  },
  subcuenta: {
    bg: "bg-[#ecfaf2]",
    border: "border-[#0cb455]",
    text: "text-[#008d42]",
    icon: "text-[#0cb455]",
  },
};

const naturalezaColors: Record<string, string> = {
  Activos: "bg-blue-100 text-blue-700",
  Pasivos: "bg-pink-100 text-pink-700",
  Patrimonio: "bg-emerald-100 text-emerald-700",
};

export default function CatalogoTree({
  data,
  isLoading,
  isError,
  error,
  canEdit,
  canCreate,
  onCreate,
  onEdit,
  onToggleStatus,
}: CatalogoTreeProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-[#5370b8]">
        <FontAwesomeIcon icon={faSpinner} className="text-3xl animate-spin" />
        <p className="text-lg">Cargando catálogo…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-red-500">
        <FontAwesomeIcon icon={faTriangleExclamation} className="text-3xl" />
        <p className="text-lg">{error?.message ?? "Error al cargar el catálogo."}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-[#8c97a8]">
        <FontAwesomeIcon icon={faFolderOpen} className="text-3xl" />
        <p className="text-lg">No se encontraron resultados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((elemento) => {
        const elKey = elemento.uuidElementoContable;
        const elOpen = expanded[elKey] ?? false;
        const elColors = levelColors.elemento;
        const elementCode = String(elemento.codigoNumerico);

        return (
          <div key={elKey} className={`rounded-xl border-l-4 ${elColors.border} ${elColors.bg}`}>
            <TreeRow
              code={elementCode}
              nombre={elemento.nombre}
              nivel="elemento"
              disponible={elemento.disponible}
              naturalezaNombre={elemento.naturaleza?.nombre}
              hasChildren={(elemento.clasificaciones?.length ?? 0) > 0}
              isOpen={elOpen}
              onToggle={() => toggle(elKey)}
              onEdit={
                canEdit
                  ? () =>
                      onEdit({
                        nivel: "elemento",
                        id: elemento.id,
                        nombre: elemento.nombre,
                        idNaturaleza: elemento.idNaturaleza ?? "",
                        uuidElementoContable: elemento.uuidElementoContable,
                        uuidClasificacionContable: "",
                        uuidCuentaContable: "",
                        disponible: elemento.disponible,
                      })
                  : undefined
              }
              onCreate={
                canCreate
                  ? () =>
                      onCreate({
                        nivel: "clasificacion",
                        nombre: "",
                        idNaturaleza: "",
                        uuidElementoContable: elemento.uuidElementoContable,
                        uuidClasificacionContable: "",
                        uuidCuentaContable: "",
                        disponible: true,
                      })
                  : undefined
              }
              onToggleStatus={() =>
                onToggleStatus("elemento", elemento.id, elemento.disponible)
              }
              canEdit={canEdit}
            />

            {elOpen &&
              elemento.clasificaciones?.map((clasificacion) => {
                const clKey = clasificacion.uuidClasificacionContable;
                const clOpen = expanded[clKey] ?? false;
                const clColors = levelColors.clasificacion;
                const clasCode = `${elementCode}.${clasificacion.codigoNumerico}`;

                return (
                  <div key={clKey} className={`ml-6 rounded-xl border-l-4 ${clColors.border} ${clColors.bg} my-1`}>
                    <TreeRow
                      code={clasCode}
                      nombre={clasificacion.nombre}
                      nivel="clasificacion"
                      disponible={clasificacion.disponible}
                      hasChildren={(clasificacion.cuentas?.length ?? 0) > 0}
                      isOpen={clOpen}
                      onToggle={() => toggle(clKey)}
                      onEdit={
                        canEdit
                          ? () =>
                              onEdit({
                                nivel: "clasificacion",
                                id: clasificacion.id,
                                nombre: clasificacion.nombre,
                                idNaturaleza: "",
                                uuidElementoContable: clasificacion.uuidElementoContable,
                                uuidClasificacionContable: clasificacion.uuidClasificacionContable,
                                uuidCuentaContable: "",
                                disponible: clasificacion.disponible,
                              })
                          : undefined
                      }
                      onCreate={
                        canCreate
                          ? () =>
                              onCreate({
                                nivel: "cuenta",
                                nombre: "",
                                idNaturaleza: "",
                                uuidElementoContable: clasificacion.uuidElementoContable,
                                uuidClasificacionContable: clasificacion.uuidClasificacionContable,
                                uuidCuentaContable: "",
                                disponible: true,
                              })
                          : undefined
                      }
                      onToggleStatus={() =>
                        onToggleStatus("clasificacion", clasificacion.id, clasificacion.disponible)
                      }
                      canEdit={canEdit}
                    />

                    {clOpen &&
                      clasificacion.cuentas?.map((cuenta, cuentaIdx) => {
                        const cuKey = cuenta.uuidCuentaContable;
                        const cuOpen = expanded[cuKey] ?? false;
                        const cuColors = levelColors.cuenta;
                        const cuentaCode = `${clasCode}.${String(cuentaIdx + 1).padStart(2, "0")}`;

                        return (
                          <div key={cuKey} className={`ml-6 rounded-xl border-l-4 ${cuColors.border} ${cuColors.bg} my-1`}>
                            <TreeRow
                              code={cuentaCode}
                              nombre={cuenta.nombre}
                              nivel="cuenta"
                              disponible={cuenta.disponible}
                              hasChildren={(cuenta.subcuentas?.length ?? 0) > 0}
                              isOpen={cuOpen}
                              onToggle={() => toggle(cuKey)}
                              onEdit={
                                canEdit
                                  ? () =>
                                      onEdit({
                                        nivel: "cuenta",
                                        id: cuenta.id,
                                        nombre: cuenta.nombre,
                                        idNaturaleza: cuenta.idNaturaleza ?? "",
                                        uuidElementoContable: cuenta.uuidElementoContable,
                                        uuidClasificacionContable: cuenta.uuidClasificacionContable,
                                        uuidCuentaContable: cuenta.uuidCuentaContable,
                                        disponible: cuenta.disponible,
                                      })
                                  : undefined
                              }
                              onCreate={
                                canCreate
                                  ? () =>
                                      onCreate({
                                        nivel: "subcuenta",
                                        nombre: "",
                                        idNaturaleza: "",
                                        uuidElementoContable: cuenta.uuidElementoContable,
                                        uuidClasificacionContable: cuenta.uuidClasificacionContable,
                                        uuidCuentaContable: cuenta.uuidCuentaContable,
                                        disponible: true,
                                      })
                                  : undefined
                              }
                              onToggleStatus={() =>
                                onToggleStatus("cuenta", cuenta.id, cuenta.disponible)
                              }
                              canEdit={canEdit}
                            />

                            {cuOpen &&
                              cuenta.subcuentas?.map((subcuenta, subIdx) => {
                                const scColors = levelColors.subcuenta;
                                const subCode = `${cuentaCode}.${String(subIdx + 1).padStart(3, "0")}`;

                                return (
                                  <div
                                    key={subcuenta.uuidSubCuentaContable}
                                    className={`ml-6 rounded-xl border-l-4 ${scColors.border} ${scColors.bg} my-1`}
                                  >
                                    <TreeRow
                                      code={subCode}
                                      nombre={subcuenta.nombre}
                                      nivel="subcuenta"
                                      disponible={subcuenta.disponible}
                                      hasChildren={false}
                                      isOpen={false}
                                      onToggle={() => {}}
                                      onEdit={
                                        canEdit
                                          ? () =>
                                              onEdit({
                                                nivel: "subcuenta",
                                                id: subcuenta.id,
                                                nombre: subcuenta.nombre,
                                                idNaturaleza: subcuenta.idNaturaleza ?? "",
                                                uuidElementoContable: subcuenta.uuidElementoContable,
                                                uuidClasificacionContable: subcuenta.uuidClasificacionContable,
                                                uuidCuentaContable: subcuenta.uuidCuentaContable,
                                                disponible: subcuenta.disponible,
                                              })
                                          : undefined
                                      }
                                      onToggleStatus={() =>
                                        onToggleStatus("subcuenta", subcuenta.id, subcuenta.disponible)
                                      }
                                      canEdit={canEdit}
                                    />
                                  </div>
                                );
                              })}
                          </div>
                        );
                      })}
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}

interface TreeRowProps {
  code: string;
  nombre: string;
  nivel: NivelCatalogoContable;
  disponible: boolean;
  naturalezaNombre?: string;
  hasChildren: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  onCreate?: () => void;
  onToggleStatus: () => void;
  canEdit: boolean;
}

function TreeRow({
  code,
  nombre,
  nivel,
  disponible,
  naturalezaNombre,
  hasChildren,
  isOpen,
  onToggle,
  onEdit,
  onCreate,
  onToggleStatus,
  canEdit,
}: TreeRowProps) {
  const colors = levelColors[nivel];
  const isLeaf = nivel === "subcuenta";

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5">
      <div className="flex items-center gap-2 min-w-0">
        {hasChildren ? (
          <button type="button" onClick={onToggle} className={`${colors.text} text-sm`}>
            <FontAwesomeIcon icon={isOpen ? faChevronDown : faChevronRight} />
          </button>
        ) : (
          <span className="w-4" />
        )}

        <FontAwesomeIcon
          icon={isLeaf ? faFileLines : faFolder}
          className={`${colors.icon} text-base`}
        />

        <span className={`text-sm font-bold ${colors.text}`}>
          {code}
        </span>

        <span className={`text-sm font-medium ${disponible ? "text-[#24364d]" : "text-[#8c97a8] line-through"}`}>
          {nombre}
        </span>

        {naturalezaNombre && (
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              naturalezaColors[naturalezaNombre] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {naturalezaNombre}
          </span>
        )}

        <span
          className={`ml-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            disponible
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {disponible ? "Activa" : "Inactiva"}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {canEdit && (
          <button
            type="button"
            onClick={onToggleStatus}
            className={`rounded-lg p-1.5 text-lg transition-colors ${
              disponible
                ? "text-green-500 hover:bg-green-50"
                : "text-gray-400 hover:bg-gray-100"
            }`}
            title={disponible ? "Desactivar" : "Activar"}
          >
            <FontAwesomeIcon icon={disponible ? faToggleOn : faToggleOff} />
          </button>
        )}

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg p-1.5 text-sm text-[#5370b8] transition-colors hover:bg-[#eaf1ff]"
            title="Editar"
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        )}

        {onCreate && (
          <button
            type="button"
            onClick={onCreate}
            className="rounded-lg p-1.5 text-sm text-[#0aa6a2] transition-colors hover:bg-[#e6f7f7]"
            title="Agregar hijo"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        )}
      </div>
    </div>
  );
}
