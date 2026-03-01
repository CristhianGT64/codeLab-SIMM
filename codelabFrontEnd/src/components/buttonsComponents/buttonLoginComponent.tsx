import type PropsButtons from "../../interfaces/ButtonInterface/ButtonsInterface";

export default function ButtonLogin(props : PropsButtons) {

  return (
    <button
      type={props.typeButton}
      className={props.className}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}
