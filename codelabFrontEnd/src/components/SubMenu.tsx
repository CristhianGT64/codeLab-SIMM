import {
  faCartShopping,
  faCog,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ButtonsInterface } from "../interfaces/ButtonInterface/ButtonsInterface";
import ButtonsComponet from "./buttonsComponents/ButtonsComponet";

interface SubMenuProps {
  Buttons: ButtonsInterface[];
}

export default function SubMenu({ Buttons }: Readonly<SubMenuProps>) {
  return (
    <ul className="w-full flex mb-8 border-[#f3f5f8] bg-[#f3f5f8] shadow-[0_6px_18px_rgba(0,0,0,0.1)] px-6 py-3 rounded-lg items-center">
      {Buttons.map((button, index) => (
        <ButtonsComponet key={index} {...button} />
      ))}
    </ul>
  );
}
