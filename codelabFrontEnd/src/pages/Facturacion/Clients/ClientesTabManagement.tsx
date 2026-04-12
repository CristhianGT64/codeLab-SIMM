import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import SubMenu from "../../../components/SubMenu";
import {
  botonVerGestionClientes,
  botonVerTiposCliente,
} from "../../../data/dataAdministrator/ClientesManagementData";
import ClientsManagement from "./ClientsManagement";
import TiposClienteManagement from "../../Administration/TiposdeClientes/TiposClienteManagement";

export default function ClientesTabManagement() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "tipos" ? "tipos" : "gestion";
  const [isGestion, setIsGestion] = useState<boolean>(initialTab === "gestion");
  const [isTipos, setIsTipos] = useState<boolean>(initialTab === "tipos");

  const handleVerGestion = () => {
    setIsGestion(true);
    setIsTipos(false);
  };

  const handleVerTipos = () => {
    setIsGestion(false);
    setIsTipos(true);
  };

  return (
    <div className="">
      {/* Sub menu de elección */}
      <SubMenu
        Buttons={[
          {
            ...botonVerGestionClientes,
            onClick: handleVerGestion,
            className: `${botonVerGestionClientes.className} ${
              isGestion
                ? "underline underline-offset-16 text-[#1498b2]"
                : "text-[#4661b0]"
            }`,
          },
          {
            ...botonVerTiposCliente,
            onClick: handleVerTipos,
            className: `${botonVerTiposCliente.className} ${
              isTipos
                ? "underline underline-offset-16 text-[#1498b2]"
                : "text-[#4661b0]"
            }`,
          },
        ]}
      />

      {/* Contenido según la pestaña seleccionada */}
      {isGestion && <ClientsManagement />}
      {isTipos && <TiposClienteManagement />}
    </div>
  );
}
