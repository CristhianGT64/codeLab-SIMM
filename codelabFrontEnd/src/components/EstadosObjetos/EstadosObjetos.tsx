import type { IestadosObjetos } from "../../interfaces/IestadosObjetos";

export default function EstadosObjetos(props: Readonly<IestadosObjetos>) {
  return (
    <span className={props.className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={props.svgD} />
      </svg>
      {props.mensaje}
    </span>
  );
}
