import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faPowerOff,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import type { TipoCliente } from "../../interfaces/TiposdeCliente/TipoClienteInterface";
import useChangeTipoClienteStatus from "../../hooks/TiposDeClientesHooks/useChangeTipoClienteStatus";

interface Props {
  tipoCliente: TipoCliente;
  onClose: () => void;
}

export default function ConfirmDeactivateModal({ tipoCliente, onClose }: Props) {
  const statusMutation = useChangeTipoClienteStatus();
  const clientesCount = tipoCliente._count?.clientes ?? 0;
  const isDeactivating = tipoCliente.disponible;
  const hasClients = isDeactivating && clientesCount > 0;

  const handleConfirm = () => {
    if (hasClients) return;
    statusMutation.mutate(
      { id: tipoCliente.id, disponible: !tipoCliente.disponible },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div
          className={`flex items-center gap-4 rounded-t-2xl px-6 py-5 text-white ${
            isDeactivating
              ? "bg-linear-to-r from-red-600 to-red-400"
              : "bg-linear-to-r from-green-600 to-green-400"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <FontAwesomeIcon icon={faPowerOff} className="text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">
              {isDeactivating ? "Desactivar Tipo" : "Activar Tipo"}
            </h3>
            <p className="text-sm opacity-80">Confirma esta acción</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-2xl text-white/80 hover:text-white"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-base text-gray-700">
            ¿Estás seguro que deseas{" "}
            <span className="font-bold">
              {isDeactivating ? "desactivar" : "activar"}
            </span>{" "}
            el tipo de cliente{" "}
            <span className="font-bold text-[#0a4d76]">
              {tipoCliente.nombre}
            </span>
            ?
          </p>

          {isDeactivating && clientesCount > 0 && (
            <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="mt-0.5 text-amber-500"
              />
              <p className="text-sm text-amber-800">
                Este tipo tiene{" "}
                <span className="font-bold">{clientesCount} cliente(s)</span>{" "}
                asignado(s). Debes reasignarlos antes de desactivar.
              </p>
            </div>
          )}

          {statusMutation.error && (
            <p className="text-sm font-semibold text-red-600">
              {statusMutation.error.message}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={statusMutation.isPending}
              className="h-12 cursor-pointer rounded-xl border-2 border-gray-200 text-base font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={statusMutation.isPending || hasClients}
              className={`h-12 cursor-pointer rounded-xl text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-70 ${
                isDeactivating
                  ? "bg-linear-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500"
                  : "bg-linear-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500"
              }`}
            >
              {statusMutation.isPending
                ? isDeactivating
                  ? "Desactivando..."
                  : "Activando..."
                : isDeactivating
                  ? "Desactivar"
                  : "Activar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
