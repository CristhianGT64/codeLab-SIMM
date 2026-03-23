import { useState } from "react";
import SubMenu from "../../components/SubMenu";
import {
  botonVerHistorial,
  botonVerPuntoVenta,
} from "../../data/dataAdministrator/VentasManagementData";
import { POSMain } from "./Punto-Venta-POS/PuntoVentaPos";
import HistorialPOS from "./Punto-Venta-POS/HistorialPOS";

export default function VentasManagement() {
  const [isPos, setIsPos] = useState<boolean>(true);
  const [isHistorialVenta, setIsHistorialVenta] = useState<boolean>(false);
  const handleVerPuntoVenta = () => {
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
            onClick:handleVerPuntoVenta,
            className: `${botonVerPuntoVenta.className} ${isPos ? "underline underline-offset-16 text-[#1498b2]" : "text-[#4661b0]"}`,
          },
          {
            ...botonVerHistorial,
            onClick: handleVerHistorialVenta,
            className: `${botonVerHistorial.className} ${isHistorialVenta ? "underline underline-offset-16 text-[#1498b2]" : "text-[#4661b0]"}`,
          },
        ]}
      />

      {/* Llamado de ventanas segun lo que sea true */}

      {isPos && <POSMain />}
      {isHistorialVenta && <HistorialPOS />}
    </div>
  );
}
