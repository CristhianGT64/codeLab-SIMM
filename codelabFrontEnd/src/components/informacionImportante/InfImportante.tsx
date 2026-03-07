import type { InformacionImportanteInterface } from "../../interfaces/informacionImportante/InformacionImportanteInterface";

export default function InfImportante(props : Readonly<InformacionImportanteInterface>) {
  return (
    <div className="mt-6 rounded-xl border-l-4 border-[#0aa6a2] bg-[#e8f3f5] p-5">
      <h3 className="text-3xl font-bold text-[#0a4d76]">
        {props.titulo}
      </h3>
      <ul className="mt-3 list-disc space-y-1 pl-6 text-xl text-[#4661b0]">
        {props.puntos.map((punto : string) => (
        <li
            key={punto}
        >{punto}</li>
        ))}
      </ul>
    </div>
  );
}
