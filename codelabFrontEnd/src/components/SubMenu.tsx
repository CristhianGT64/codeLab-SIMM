import type { ButtonsInterface } from "../interfaces/ButtonInterface/ButtonsInterface";
import ButtonsComponet from "./buttonsComponents/ButtonsComponet";

interface SubMenuProps {
  Buttons: ButtonsInterface[];
}

export default function SubMenu({ Buttons }: Readonly<SubMenuProps>) {
  return (
    <ul className="w-full flex mb-8 border-[#f3f5f8] bg-[#f3f5f8] px-6 py-3 rounded-lg items-center">
      {Buttons.map((button, index) => (
        <ButtonsComponet key={index} {...button} />
      ))}
    </ul>
  );
}
