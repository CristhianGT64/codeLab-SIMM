import type { ButtonsInterface } from "../../interfaces/ButtonInterface/ButtonsInterface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBuildingFlag,
  faCircleQuestion,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export default function ButtonsComponet(props: Readonly<ButtonsInterface>) {

	const iconsByClass: Record<string, IconDefinition> = {
		"fa-solid fa-users": faUsers,
		"fa-users": faUsers,
		"fa-solid fa-building-flag": faBuildingFlag,
		"fa-building-flag": faBuildingFlag,
    "fa-solid fa-plus" :faPlus,
	};

  const getIconByClass = (iconClass: string): IconDefinition => {
    const normalizedIcon = iconClass.trim().toLowerCase();
    return iconsByClass[normalizedIcon] ?? faCircleQuestion;
  };

  const selectedIcon = getIconByClass(props.icon);

  return (
    <button
      type={props.typeButton}
      className={props.className}
      onClick={props.onClick}
    >
      {<FontAwesomeIcon icon={selectedIcon} />}
      <span>{props.text}</span>
    </button>
  );
}
