import type { SyntheticEvent } from "react";
import {
  botonCancelarNuevoCai,
  botonGuardarNuevoCai,
} from "../../data/dataAdministrator/ConfiguracionCAIData";
import type { FormNuevoCai } from "../../interfaces/CAI/Icai";
import ButtonsComponet from "../buttonsComponents/ButtonsComponet";

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  // Bloquea 'e', 'E', y opcionalmente signos como '+', '-' o '.'
  if (["e", "E", "+", "-", "."].includes(e.key)) {
    e.preventDefault();
  }
};

export function FormNuevoCAI({
  ocultarFormularioNuevoCai,
  form,
  onChangeField,
  onSubmitForm,
  handleChange,
}: {
  ocultarFormularioNuevoCai: () => void;
  form: FormNuevoCai;
  onSubmitForm: (event: SyntheticEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeField: (
    field: keyof FormNuevoCai,
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <section
      id="formularioNuevoCai"
      className="p-6 mb-8 mt-3 border-[#f3f5f8] hover:border-t-[#1498b2] border-6 rounded-2xl bg-[#f3f5f8] shadow-[0_6px_18px_rgba(0,0,0,0.1)]"
    >
      <div className="flex justify-between items-center mb-4">
        {" "}
        {/* Final de la primera fila */}
        <h2 className="mt-1 text-lg font-bold text-[#0b4d77] md:text-xl">
          Registrar Nuevo CAI
        </h2>
      </div>
      <form onSubmit={onSubmitForm}>
        {/* Numero de CAI */}
        <div className="mb-4 ">
          <label className="mb-2 block text-xl font-semibold text-[#0a4d76]">
            Número de CAI <span className="text-[#FF4B4B]">*</span>
          </label>
          <input
            value={form.codigo}
            onChange={handleChange}
            required
            type="text"
            className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none focus:border-[#0aa6a2]"
            placeholder="F8A3E2-4D5C6B-7E8F9A-0B1C2D-3E4F5A-6B"
          />
          <span className="text-lg text-[#4661b0] font-semibold">
            Ingrese el número de CAI autorizado por la SAR
          </span>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="mb-2 block text-xl font-semibold text-[#0a4d76]">
              Rango Inicial <span className="text-[#FF4B4B]">*</span>
            </label>
            <input
              value={form.inicioRango}
              onChange={onChangeField("inicioRango")}
              required
              min={0}
              onKeyDown={handleKeyDown}
              type="number"
              className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none focus:border-[#0aa6a2]"
              placeholder="1000000"
            />
          </div>
          <div className="w-1/2">
            <label className="mb-2 block text-xl font-semibold text-[#0a4d76]">
              Rango Final <span className="text-[#FF4B4B]">*</span>
            </label>
            <input
              value={form.finalRango}
              onChange={onChangeField("finalRango")}
              onKeyDown={handleKeyDown}
              required
              type="number"
              className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none focus:border-[#0aa6a2]"
              placeholder="1005000"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-xl font-semibold text-[#0a4d76]">
            Fecha de Inicio <span className="text-[#FF4B4B]">*</span>
          </label>
          <input
            value={
              form.fechaInicio instanceof Date &&
              !isNaN(form.fechaInicio.getTime())
                ? form.fechaInicio.toISOString().split("T")[0]
                : ""
            }
            onChange={onChangeField("fechaInicio")}
            required
            type="date"
            className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none focus:border-[#0aa6a2]"
            placeholder="dd/mm/aaaa"
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-xl font-semibold text-[#0a4d76]">
            Fecha de Vencimiento <span className="text-[#FF4B4B]">*</span>
          </label>
          <input
            value={
              form.fechaFin instanceof Date && !isNaN(form.fechaFin.getTime())
                ? form.fechaFin.toISOString().split("T")[0]
                : ""
            }
            onChange={onChangeField("fechaFin")}
            required
            type="date"
            className="h-14 w-full rounded-2xl border-2 border-[#9adce2] bg-white px-5 text-xl text-[#24364d] outline-none focus:border-[#0aa6a2]"
            placeholder="dd/mm/aaaa"
          />
        </div>

        <div className="bg-[#E6F0F8] rounded-2xl border-2 border-[#9adce2] p-4 mb-4 text-lg text-[#2B7A78]">
          <span className="font-semibold">Importante:</span> Verifique que todos
          los datos coincidan exactamente con la autorización emitida por la SAR
          (Servicio de Administración de Rentas).
        </div>
        <div className="flex gap-4">
          <ButtonsComponet
            {...botonCancelarNuevoCai}
            onClick={ocultarFormularioNuevoCai}
          />
          <ButtonsComponet {...botonGuardarNuevoCai} />
        </div>
      </form>
    </section>
  );
}
