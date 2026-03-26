import { useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import type {
  CatalogoFormState,
  ElementoContable,
  NaturalezaContable,
  NivelCatalogoContable,
} from "../../interfaces/CatalogoCuentasContables/CatalogoCuentasContables";

interface CatalogoCuentaModalProps {
  isOpen: boolean;
  formState: CatalogoFormState;
  onClose: () => void;
  onSubmit: (payload: CatalogoFormState) => void;
  onChange: React.Dispatch<React.SetStateAction<CatalogoFormState>>;
  naturalezas: NaturalezaContable[];
  tree: ElementoContable[];
  isSubmitting: boolean;
}

const nivelLabels: Record<NivelCatalogoContable, string> = {
  elemento: "Elemento Contable",
  clasificacion: "Clasificación Contable",
  cuenta: "Cuenta Contable",
  subcuenta: "Subcuenta Contable",
};

export default function CatalogoCuentaModal({
  isOpen,
  formState,
  onClose,
  onSubmit,
  onChange,
  naturalezas,
  tree,
  isSubmitting,
}: CatalogoCuentaModalProps) {
  const isEditing = Boolean(formState.id);

  const clasificaciones = useMemo(() => {
    const elemento = tree.find(
      (e) => e.uuidElementoContable === formState.uuidElementoContable,
    );
    return elemento?.clasificaciones ?? [];
  }, [tree, formState.uuidElementoContable]);

  const cuentas = useMemo(() => {
    const clasificacion = clasificaciones.find(
      (c) => c.uuidClasificacionContable === formState.uuidClasificacionContable,
    );
    return clasificacion?.cuentas ?? [];
  }, [clasificaciones, formState.uuidClasificacionContable]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFieldChange = (field: keyof CatalogoFormState, value: string | boolean) => {
    onChange((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formState);
  };

  const showNaturaleza =
    formState.nivel === "elemento" ||
    formState.nivel === "cuenta" ||
    formState.nivel === "subcuenta";

  const showElementoSelect =
    formState.nivel === "clasificacion" ||
    formState.nivel === "cuenta" ||
    formState.nivel === "subcuenta";

  const showClasificacionSelect =
    formState.nivel === "cuenta" || formState.nivel === "subcuenta";

  const showCuentaSelect = formState.nivel === "subcuenta";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(27,60,93,0.2)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-lg text-[#8c97a8] transition-colors hover:text-[#24364d]"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <h2 className="mb-5 text-xl font-bold text-[#0b4d77] md:text-2xl">
          {isEditing ? "Editar" : "Crear"} {nivelLabels[formState.nivel]}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#24364d]">
              Nombre
            </label>
            <input
              type="text"
              required
              value={formState.nombre}
              onChange={(e) => handleFieldChange("nombre", e.target.value)}
              placeholder={`Nombre del ${nivelLabels[formState.nivel].toLowerCase()}`}
              className="h-11 w-full rounded-xl border-2 border-[#9adce2] bg-white px-4 text-base text-[#24364d] outline-none focus:border-[#5370b8]"
            />
          </div>

          {showNaturaleza && (
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#24364d]">
                Naturaleza
              </label>
              <select
                required
                value={formState.idNaturaleza}
                onChange={(e) => handleFieldChange("idNaturaleza", e.target.value)}
                className="h-11 w-full rounded-xl border-2 border-[#9adce2] bg-white px-4 text-base text-[#24364d] outline-none focus:border-[#5370b8]"
              >
                <option value="">Seleccionar naturaleza</option>
                {naturalezas.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showElementoSelect && !isEditing && (
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#24364d]">
                Elemento Contable
              </label>
              <select
                required
                value={formState.uuidElementoContable}
                onChange={(e) => handleFieldChange("uuidElementoContable", e.target.value)}
                className="h-11 w-full rounded-xl border-2 border-[#9adce2] bg-white px-4 text-base text-[#24364d] outline-none focus:border-[#5370b8]"
              >
                <option value="">Seleccionar elemento</option>
                {tree
                  .filter((e) => e.disponible)
                  .map((e) => (
                    <option key={e.uuidElementoContable} value={e.uuidElementoContable}>
                      {e.codigoNumerico} - {e.nombre}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {showClasificacionSelect && !isEditing && (
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#24364d]">
                Clasificación Contable
              </label>
              <select
                required
                value={formState.uuidClasificacionContable}
                onChange={(e) => handleFieldChange("uuidClasificacionContable", e.target.value)}
                className="h-11 w-full rounded-xl border-2 border-[#9adce2] bg-white px-4 text-base text-[#24364d] outline-none focus:border-[#5370b8]"
              >
                <option value="">Seleccionar clasificación</option>
                {clasificaciones
                  .filter((c) => c.disponible)
                  .map((c) => (
                    <option key={c.uuidClasificacionContable} value={c.uuidClasificacionContable}>
                      {c.codigoNumerico} - {c.nombre}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {showCuentaSelect && !isEditing && (
            <div>
              <label className="mb-1 block text-lg font-semibold text-[#24364d]">
                Cuenta Contable
              </label>
              <select
                required
                value={formState.uuidCuentaContable}
                onChange={(e) => handleFieldChange("uuidCuentaContable", e.target.value)}
                className="h-11 w-full rounded-xl border-2 border-[#9adce2] bg-white px-4 text-base text-[#24364d] outline-none focus:border-[#5370b8]"
              >
                <option value="">Seleccionar cuenta</option>
                {cuentas
                  .filter((c) => c.disponible)
                  .map((c) => (
                    <option key={c.uuidCuentaContable} value={c.uuidCuentaContable}>
                      {c.codigoNumerico} - {c.nombre}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              id="disponible"
              type="checkbox"
              checked={formState.disponible}
              onChange={(e) => handleFieldChange("disponible", e.target.checked)}
              className="h-4 w-4 rounded border-[#9adce2] accent-[#0aa6a2]"
            />
            <label htmlFor="disponible" className="text-sm text-[#24364d]">
              Activo
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl border-2 border-[#9adce2] px-6 text-base font-semibold text-[#24364d] transition-colors hover:bg-[#f3f5f8]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] px-6 text-base font-bold text-white shadow-[0_6px_14px_rgba(79,115,184,0.2)] transition-all hover:from-[#034d4a] hover:to-[#2c3d70] disabled:opacity-60"
            >
              {isSubmitting ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              ) : isEditing ? (
                "Guardar Cambios"
              ) : (
                "Crear"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
