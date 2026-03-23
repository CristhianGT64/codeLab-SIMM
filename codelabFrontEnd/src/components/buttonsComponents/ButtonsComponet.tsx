import type { ButtonsInterface } from "../../interfaces/ButtonInterface/ButtonsInterface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import type { IconName } from "@fortawesome/fontawesome-svg-core";

// Registrar todos los iconos sólidos
library.add(fas);

export default function ButtonsComponet(props: Readonly<ButtonsInterface>) {

  const getIconName = (iconClass: string): IconName => {
    // Extraer el nombre del icono de la clase (ej: "fa-solid fa-users" -> "users")
    const match = /fa-([a-z-]+)$/i.exec(iconClass);
    return (match ? match[1] : "circle-question") as IconName;
  };

  const iconName = getIconName(props.icon);

  return (
    <button
      type={props.typeButton}
      className={props.className}
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label={props.ariaLabel ?? props.text}
      title={props.ariaLabel ?? props.text}
    >
      {props.icon === '' ? '' : <FontAwesomeIcon icon={["fas", iconName]} />}
      <span className={props.labelClassName}>{props.text}</span>
    </button>
  );
}
