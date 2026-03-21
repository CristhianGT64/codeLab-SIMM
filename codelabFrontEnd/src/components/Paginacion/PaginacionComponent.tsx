import type { IpaginacionProps } from "../../interfaces/PaginacionBotones/Ipaginacion";
import BtnPagina from "../ButtonPaginacion/buttonPaginacion";

export default function PaginacionComponent(props: Readonly<IpaginacionProps>) {
  return (
    <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
      {/* Info de registros */}
      <p className="text-[#4661b0] md:text-xl mb-2">
        Mostrando{" "}
        <span className="font-semibold text-[#4661b0] md:text-xl mb-2">
          {`${props.inicio + 1} - ${Math.min(props.fin, props.registros.length)}`}
        </span>{" "}
        de{" "}
        <span className="font-semibold text-[#4661b0] md:text-xl mb-2">
          {props.registros.length}
        </span>{" "}
        registros
      </p>

      {/* Botones de página */}
      <div className="flex items-center gap-1">
        {/* ← Anterior */}
        <BtnPagina
          onClick={() => props.action(props.paginaActual - 1)}
          disabled={props.paginaActual === 1}
          label="←"
        />
        {/* Números de página */}
        {Array.from({ length: props.totalPaginas }, (_, i) => i + 1).map(
          (p) => (
            <BtnPagina
              key={p}
              onClick={() => props.action(p)}
              activa={p === props.paginaActual}
              label={String(p)}
            />
          ),
        )}

        {/* → Siguiente */}
        <BtnPagina
          onClick={() => props.action(props.paginaActual + 1)}
          disabled={props.paginaActual === props.totalPaginas}
          label="→"
        />
      </div>
    </div>
  );
}
