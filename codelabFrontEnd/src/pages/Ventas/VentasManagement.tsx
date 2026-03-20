import SubMenu from "../../components/SubMenu";
import { botonVerPuntoVenta } from "../../data/dataAdministrator/VentasManagementData";

export default function VentasManagement() {
  return (
    <div>
      {/* Sub menu de eleccion */}
      <SubMenu
        Buttons={[botonVerPuntoVenta]}
      />
    </div>
  );
}
