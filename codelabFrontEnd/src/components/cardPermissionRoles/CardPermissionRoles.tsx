import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
  faShield,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import type { CardPermissionRolesInterface } from "../../interfaces/cardPermissionRolesInterface/CardPermissionRolesInterface";
import ButtonsComponet from "../buttonsComponents/ButtonsComponet";
import { useNavigate } from "react-router";

const roleHeaderStyles: Record<string, string> = {
  Administrador: "bg-[#104f78]",
  Editor: "bg-[#0aa6a2]",
  Visualizador: "bg-[#4dc9cf]",
};

export default function CardPermissionRolesComponent(infoCard : Readonly<CardPermissionRolesInterface>) {

    const navigate = useNavigate();

  return (
    <div
      key={infoCard.id}
      className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_18px_rgba(0,0,0,0.08)]"
    >
      {/* Header de la tarjeta */}
      <div
        className={`flex items-center gap-3 px-5 py-4 ${roleHeaderStyles[infoCard.name] ?? "bg-[#0aa6a2]"}`}
      >
        <FontAwesomeIcon icon={faShield} className="text-2xl text-white/80" />
        <div>
          <h3 className="text-xl font-bold text-white">{infoCard.name}</h3>
          {infoCard.subTitle && (
            <p className="text-sm text-white/70">{infoCard.subTitle}</p>
          )}
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-5">
        <p className="text-base text-[#4661b0]">{infoCard.description}</p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6a758f]">Permisos asignados:</span>
            <span className="text-sm font-bold text-[#0aa6a2]">
              {infoCard.totalPermissionAssigned}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6a758f]">
              Usuarios con este rol:
            </span>
            <span className="text-sm font-bold text-[#0a4d76]">
              {infoCard.totalUserRol}
            </span>
          </div>
        </div>

        {/* Alerta si tiene usuarios asignados */}
        {infoCard.totalUserRol > 0 && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#fef3cd] px-3 py-2">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="text-sm text-[#856404]"
            />
            <span className="text-xs text-[#856404]">
              Este rol está asignado a {infoCard.totalUserRol} usuario(s). No se
              puede eliminar.
            </span>
          </div>
        )}

        {/* Botones de acción */}
        <div className="mt-4 flex gap-3">
            <ButtonsComponet
              text='Editar'
              typeButton="button"
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0aa6a2] px-4 py-3 text-base font-semibold text-white hover:bg-[#06706d]"
              icon="fa-solid fa-pen-to-square"
              onClick={() => navigate(`/RolesPermision-Management/Update-Roles/${infoCard.id}`)}
              disabled={false}
            />
          <button
            type="button"
            className=""
          >
            <FontAwesomeIcon icon={faPenToSquare} />
            Editar
          </button>
          <button
            type="button"
            disabled={infoCard.totalUserRol > 0}
            className={`flex w-12 cursor-pointer items-center justify-center rounded-xl border-2 text-lg ${
              infoCard.totalUserRol > 0
                ? "border-[#d1d5db] bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed"
                : "border-[#fde2e2] bg-[#fef2f2] text-[#c20000] hover:bg-[#fde2e2]"
            }`}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      </div>
    </div>
  );
}
