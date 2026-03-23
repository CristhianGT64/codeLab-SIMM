import type { IbotonPaginacion } from "../../interfaces/PaginacionBotones/IbotonPaginacion";

export default function BtnPagina(button: Readonly<IbotonPaginacion>) {
  let estadoClase = "hover:bg-[#edf8fa] text-[#24364d] cursor-pointer";
  if (button.activa) {
    estadoClase = "bg-[#4661b0] text-white shadow-sm";
  } else if (button.disabled) {
    estadoClase = "opacity-30 cursor-not-allowed text-[#6b7a8f]";
  }

  return (
    <button
      onClick={button.onClick}
      disabled={button.disabled}
      className={[
        "w-10 h-10 md:w-11 md:h-11  md:text-xl rounded-lg flex items-center justify-center text-sm font-medium transition-colors",
        estadoClase,
      ].join(" ")}
    >
      {button.label}
    </button>
  );
}
