import type { Ialertas } from "../../interfaces/Alertas/Ialertas";

export default function AlertaComponent(props : Readonly<Ialertas>) {

    /* Alertas */
  return (
    <div
      className="border-2 rounded-xl p-3 grid grid-cols-1 items-center mb-2"
      style={{ borderColor: props.colorBorder, backgroundColor: props.bg }}
    >
      <div className="flex items-center">
        <svg
          className="w-7 h-7 mr-2 items-center"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: props.colorSvg }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={props.svgD}
          />
        </svg>
        <div>
          <span
            className="font-semibold mb-5 text-s"
            style={{ color: props.colorTitle }}
          >
            {props.title}
          </span>
        </div>
      </div>
      <p className="text-s" style={{ color: props.colorMessage }}>
        {props.message}
      </p>
    </div>
  );
}
