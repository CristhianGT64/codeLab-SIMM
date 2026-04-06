import { useState } from "react";
import AlertaComponent from "../../components/Alertas/AlertaComponent";
import SubMenu from "../../components/SubMenu";
import useReadCaiVigente from "../../hooks/CaiHooks/useReadCaiVigente";
import {
  botonVerHistorial,
  botonVerPuntoVenta,
} from "../../data/dataAdministrator/VentasManagementData";
import { POSMain } from "./Punto-Venta-POS/PuntoVentaPos";
import HistorialPOS from "./Punto-Venta-POS/HistorialPOS";
import { getCaiPosBlockInfo } from "../../utils/caiUtils";

export default function VentasManagement() {
  const [isPos, setIsPos] = useState<boolean>(true);
  const [isHistorialVenta, setIsHistorialVenta] = useState<boolean>(false);
  const { data: caiVigenteData, isLoading: isLoadingCaiVigente } =
    useReadCaiVigente();
  const caiVigente = caiVigenteData?.data;
  const posBlockInfo = isLoadingCaiVigente ? null : getCaiPosBlockInfo(caiVigente);

  const isPosBlocked = isLoadingCaiVigente || Boolean(posBlockInfo);

  const handleVerPuntoVenta = () => {
    if (isPosBlocked) return;
    setIsPos(true);
    setIsHistorialVenta(false);
  };

  const handleVerHistorialVenta = () => {
    setIsPos(false);
    setIsHistorialVenta(true);
  };

  return (
    <div className="">
      {/* Sub menu de eleccion */}
      <SubMenu
        Buttons={[
          {
            ...botonVerPuntoVenta,
            onClick: handleVerPuntoVenta,
            disabled: isPosBlocked,
            ariaLabel: isLoadingCaiVigente
              ? "Validando CAI para habilitar el punto de venta"
              : posBlockInfo?.message ?? botonVerPuntoVenta.text,
            className: `${botonVerPuntoVenta.className} ${
              isPosBlocked
                ? "text-gray-400 cursor-not-allowed hover:text-gray-400"
                : isPos
                  ? "underline underline-offset-16 text-[#1498b2]"
                  : "text-[#4661b0]"
            }`,
          },
          {
            ...botonVerHistorial,
            onClick: handleVerHistorialVenta,
            className: `${botonVerHistorial.className} ${isHistorialVenta ? "underline underline-offset-16 text-[#1498b2]" : "text-[#4661b0]"}`,
          },
        ]}
      />

      {/* Llamado de ventanas segun lo que sea true */}

      {isPos && isLoadingCaiVigente && (
        <div className="mx-6 rounded-2xl bg-white p-8 shadow-md">
          <div className="flex items-center gap-4 text-[#0b4d77]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#9cd2d3] border-t-[#1498b2]"></div>
            <div>
              <h2 className="text-lg font-bold">Validando CAI vigente</h2>
              <p className="text-sm text-[#4661b0]">
                Espera un momento antes de usar el POS.
              </p>
            </div>
          </div>
        </div>
      )}
      {isPos && !isLoadingCaiVigente && posBlockInfo && (
        <div className="mx-6 rounded-2xl bg-white p-6 shadow-md">
          <AlertaComponent
            svgD="M12 9v3.75m0 3.75h.007v.008H12v-.008Zm-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126Z"
            colorSvg="#d02f21"
            bg="#fff1f2"
            colorBorder="#d02f21"
            title={posBlockInfo.title}
            message={`${posBlockInfo.message} Renueva el CAI en Configuración CAI para habilitar nuevamente la facturación.`}
            colorTitle="#991b1b"
            colorMessage="#991b1b"
          />
        </div>
      )}
      {isPos && !isLoadingCaiVigente && !posBlockInfo && <POSMain />}
      {isHistorialVenta && <HistorialPOS />}
    </div>
  );
}
