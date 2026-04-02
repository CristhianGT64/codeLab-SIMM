import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import type { TipoCliente } from "../../interfaces/TiposdeCliente/TipoClienteInterface";
import ButtonsComponet from "../buttonsComponents/ButtonsComponet";

interface Props {
  tipoCliente: TipoCliente;
  onClose: () => void;
  onEdit: (tc: TipoCliente) => void;
}

export default function DetailTipoClienteModal({
  tipoCliente,
  onClose,
  onEdit,
}: Props) {
  return (
    <>
      <style>{`body { overflow: hidden; }`}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/55 p-4">
        <div className="w-full max-w-md max-h-[70vh] overflow-hidden rounded-3xl bg-white shadow-[0_14px_36px_rgba(0,0,0,0.24)]">
          <div className="flex items-start justify-between bg-linear-to-r from-[#0aa6a2] to-[#4661b0] px-4 py-3">
            <div>
              <h3 className="text-xl font-bold text-white">
                Detalle del Tipo de Cliente
              </h3>
              <p className="mt-0.5 text-sm text-white/80">Información completa</p>
            </div>
            <button
              type="button"
              className="cursor-pointer text-xl text-white"
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 px-4 py-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <p className="text-xs text-[#4661b0] uppercase">Nombre</p>
              <p className="text-lg font-bold text-[#0b4d77]">{tipoCliente.nombre}</p>
            </div>

            <div>
              <p className="text-xs text-[#4661b0] uppercase">Estado</p>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                  tipoCliente.disponible
                    ? "bg-[#b7e4ca] text-[#008444]"
                    : "bg-[#e8ebf0] text-[#707b8d]"
                }`}
              >
                {tipoCliente.disponible ? "Activo" : "Inactivo"}
              </span>
            </div>

            <div>
              <p className="text-xs text-[#4661b0] uppercase">Clientes Asignados</p>
              <p className="text-base font-bold text-[#0b4d77]">
                {tipoCliente._count?.clientes ?? 0}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-xs text-[#4661b0] uppercase">Descripción</p>
              <p className="text-sm text-[#1f4f88]">
                {tipoCliente.descripcion || "Sin descripción"}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#4661b0] uppercase">Condición de Pago</p>
              <span className="inline-flex rounded-lg bg-[#e8f4f9] px-2 py-0.5 text-sm font-semibold text-[#1f4f88]">
                {tipoCliente.condicionPago || "No definida"}
              </span>
            </div>
            <div>
              <p className="text-xs text-[#4661b0] uppercase">Días de Crédito</p>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                  tipoCliente.diasCredito > 0
                    ? "bg-[#f9e9b6] text-[#d06800]"
                    : "bg-[#eceef2] text-[#697587]"
                }`}
              >
                {tipoCliente.diasCredito > 0
                  ? `${tipoCliente.diasCredito} días`
                  : "No aplica"}
              </span>
            </div>

            <div>
              <p className="text-xs text-[#4661b0] uppercase">Fecha Creación</p>
              <p className="text-sm font-semibold text-[#1f4f88]">
                {tipoCliente.fechaCreacion
                  ? new Date(tipoCliente.fechaCreacion).toLocaleDateString("es-HN")
                  : "-"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 border-t border-[#dbe5ef] px-4 py-2 md:grid-cols-2">
            <ButtonsComponet
              text="Cerrar"
              typeButton="button"
              className="h-9 cursor-pointer rounded-lg border-2 border-[#9adce2] bg-white text-sm font-semibold text-[#4661b0] hover:bg-[#edf8fa]"
              icon=""
              onClick={onClose}
              disabled={false}
            />
            <ButtonsComponet
              text="Editar"
              typeButton="button"
              className="h-9 cursor-pointer rounded-lg bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-sm font-semibold text-white hover:from-[#06706d] hover:to-[#334c8b]"
              icon="fa-solid fa-pen-to-square"
              onClick={() => onEdit(tipoCliente)}
              disabled={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
