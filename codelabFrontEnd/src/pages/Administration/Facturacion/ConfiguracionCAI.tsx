import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import { titleConfiguracionCAI } from "../../../data/dataAdministrator/ConfiguracionCAIData";

export default function ConfiguracionCAI() {
  return (
    <section className="px-6 py-8 bg-[#FAF8F6] min-h-screen">
      {/* Título */}
      <HeaderTitleAdmin
        {...titleConfiguracionCAI}
      />

      {/* CAI Vigente Activo */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 mt-6" >
        <div className="flex justify-between items-center mb-4">
          <h2 className="mt-1 text-lg font-bold text-[#4661b0] md:text-xl">CAI Vigente Activo</h2>
          <span className="bg-[#FFF4E5] text-[#FF9900] px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
            </svg>
            Próximo a vencer
          </span>
        </div>
        <div className="grid grid-cols-5 gap-4 mb-4">
          <div>
            <span className="text-xs text-[#4A4E69]">Número de CAI</span>
            <div className="bg-[#F4F6F8] rounded px-2 py-1 text-sm font-mono text-[#22223B] mt-1">F8A3E2-4D5C6B-7E8F9A-0B1C2D-3E4F5A-6B</div>
          </div>
          <div>
            <span className="text-xs text-[#4A4E69]">Rango Autorizado</span>
            <div className="text-sm font-semibold text-[#22223B] mt-1">1,000,000 - 1,005,000</div>
          </div>
          <div>
            <span className="text-xs text-[#4A4E69]">Fecha de Vencimiento</span>
            <div className="text-sm font-semibold text-[#22223B] mt-1">30 de diciembre de 2024</div>
            <div className="text-xs text-[#9A9A9A]">-441 días restantes</div>
          </div>
          <div>
            <span className="text-xs text-[#4A4E69]">Última Factura Emitida</span>
            <div className="text-sm font-semibold text-[#2B7A78] mt-1">1,004,800</div>
          </div>
          <div className="flex items-end justify-end">
            <button className="border border-[#2B7A78] text-[#2B7A78] px-4 py-2 rounded font-medium hover:bg-[#E6F0F8] transition">Editar CAI</button>
          </div>
        </div>


        {/* Barra de uso de rango */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-[#4A4E69] mb-1">
            <span>Inicial: 1,000,000</span>
            <span>Final: 1,005,000</span>
          </div>
          <div className="relative h-3 bg-[#F4F6F8] rounded">
            <div className="absolute left-0 top-0 h-3 bg-[#FF4B4B] rounded" style={{ width: '80%' }}></div>
          </div>
          <div className="flex justify-end text-xs text-[#22223B] mt-1">200 facturas disponibles</div>
        </div>
        {/* Alerta */}
        <div className="border border-[#FF9900] bg-[#FFF4E5] rounded p-3 flex items-center mb-2">
          <svg className="w-5 h-5 text-[#FF9900] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 17a5 5 0 100-10 5 5 0 000 10z" />
          </svg>
          <div>
            <span className="font-semibold text-[#FF9900]">Alerta de Rango Próximo a Agotarse</span>
            <p className="text-xs text-[#4A4E69]">El rango de facturación está próximo a agotarse o el CAI está por vencer. Se recomienda tramitar un nuevo CAI con la DEI para evitar interrupciones en la facturación.</p>
          </div>
        </div>
      </div>

      {/* Historial de CAIs */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-[#22223B] mb-4">Historial de CAIs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#F4F6F8] text-[#4A4E69]">
                <th className="px-4 py-2 text-left">Número de CAI</th>
                <th className="px-4 py-2 text-left">Rango</th>
                <th className="px-4 py-2 text-left">Vencimiento</th>
                <th className="px-4 py-2 text-left">Última Factura</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-[#22223B]">F8A3E2-4D5C6B-7E8F9A-0B1C2D-3E4F5A-6B</td>
                <td className="px-4 py-2">1,000,000 - 1,005,000</td>
                <td className="px-4 py-2">30 de diciembre de 2024</td>
                <td className="px-4 py-2 text-[#2B7A78]">1,004,800</td>
                <td className="px-4 py-2">
                  <span className="bg-[#FFF4E5] text-[#FF9900] px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                    </svg>
                    Próximo a vencer
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button className="border border-[#2B7A78] text-[#2B7A78] px-2 py-1 rounded hover:bg-[#E6F0F8] transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Registrar Nuevo CAI */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-[#22223B] mb-4">Registrar Nuevo CAI</h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#22223B] mb-1">Número de CAI <span className="text-[#FF4B4B]">*</span></label>
            <input type="text" className="w-full border border-[#E6E6E6] rounded px-3 py-2 text-sm font-mono focus:border-[#2B7A78] focus:outline-none" placeholder="F8A3E2-4D5C6B-7E8F9A-0B1C2D-3E4F5A-6B" />
            <span className="text-xs text-[#4A4E69] mt-1 block">Ingrese el número de CAI autorizado por la DEI</span>
          </div>
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-[#22223B] mb-1">Rango Inicial <span className="text-[#FF4B4B]">*</span></label>
              <input type="number" className="w-full border border-[#E6E6E6] rounded px-3 py-2 text-sm focus:border-[#2B7A78] focus:outline-none" placeholder="1000000" />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-[#22223B] mb-1">Rango Final <span className="text-[#FF4B4B]">*</span></label>
              <input type="number" className="w-full border border-[#E6E6E6] rounded px-3 py-2 text-sm focus:border-[#2B7A78] focus:outline-none" placeholder="1005000" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#22223B] mb-1">Fecha de Vencimiento <span className="text-[#FF4B4B]">*</span></label>
            <input type="text" className="w-full border border-[#E6E6E6] rounded px-3 py-2 text-sm focus:border-[#2B7A78] focus:outline-none" placeholder="dd/mm/aaaa" />
          </div>
          <div className="bg-[#E6F0F8] rounded p-3 mb-4 text-xs text-[#2B7A78]">
            <span className="font-semibold">Importante:</span> Verifique que todos los datos coincidan exactamente con la autorización emitida por la DEI (Dirección Ejecutiva de Ingresos).
          </div>
          <div className="flex justify-between">
            <button type="button" className="border border-[#E6E6E6] text-[#22223B] px-6 py-2 rounded font-medium hover:bg-[#F4F6F8] transition">Cancelar</button>
            <button type="submit" className="bg-gradient-to-r from-[#2B7A78] to-[#3A86FF] text-white px-6 py-2 rounded font-medium hover:opacity-90 transition flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Guardar CAI
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}