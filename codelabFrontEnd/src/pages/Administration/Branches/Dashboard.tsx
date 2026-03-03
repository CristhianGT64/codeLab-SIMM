import React, { useState } from 'react';
// Rutas de importación ajustadas a tu estructura (3 niveles atrás)
import useSucursales from '../../../hooks/useSucursales';
import CardTotalComponent from '../../../components/cardTotalComponent/CardTotalComponent';
import SucursalModal from './Components/SucursalModal';

const Branches = () => {
  const { sucursalesQuery, statusMutation } = useSucursales();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSucursal, setSelectedSucursal] = useState<any>(null);

  // 1. Aseguramos que sucursales sea un array para evitar errores de .length
  const sucursales = (sucursalesQuery.data?.data || []) as any[];

  // 2. Cálculos numéricos para las tarjetas de resumen
  const totalSucursales: number = sucursales.length;
  const sucursalesActivas: number = sucursales.filter((s: any) => s.activa).length;
  const sucursalesInactivas: number = totalSucursales - sucursalesActivas;

  const openModal = (sucursal = null) => {
    setSelectedSucursal(sucursal);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 bg-[#f2e6cf] min-h-screen font-sans text-[#114c5f]">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold">Gestión de Sucursales</h1>
          <p className="text-[#4a6eb0] mt-1 font-medium">Panel Administrativo</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-[#0799b6] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#114c5f] transition-all"
        >
          + Nueva Sucursal
        </button>
      </div>

      {/* 3. Cards de Resumen - Implementando colorNumber como propiedad obligatoria */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <CardTotalComponent 
          title="Total" 
          total={totalSucursales} 
          colorNumber="#4a6eb0" 
        />
        <CardTotalComponent 
          title="Activas" 
          total={sucursalesActivas} 
          colorNumber="#0799b6" 
        />
        <CardTotalComponent 
          title="Inactivas" 
          total={sucursalesInactivas} 
          colorNumber="#114c5f" 
        />
      </div>

      {/* Tabla de Sucursales */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#9cd2d3]">
        <table className="w-full text-left">
          <thead className="bg-[#0799b6] text-white">
            <tr>
              <th className="p-5 text-sm font-bold uppercase">Sucursal / Dirección</th>
              <th className="p-5 text-sm font-bold uppercase">Gerente</th>
              <th className="p-5 text-sm font-bold uppercase text-center">Estado</th>
              <th className="p-5 text-sm font-bold uppercase text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sucursales.length > 0 ? (
              sucursales.map((s: any) => (
                <tr key={s.id} className="hover:bg-[#9cd2d3]/10 transition-colors">
                  <td className="p-5">
                    <div className="font-bold text-lg text-[#114c5f]">{s.nombre}</div>
                    <div className="text-sm text-gray-500 italic">{s.direccion}</div>
                  </td>
                  <td className="p-5 text-[#4a6eb0] font-medium">{s.gerente}</td>
                  <td className="p-5 text-center">
                    <span className={`px-4 py-1 rounded-full text-xs font-black ${
                      s.activa ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {s.activa ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center gap-6 text-xl">
                      <button 
                        onClick={() => openModal(s)} 
                        className="hover:scale-125 transition-transform cursor-pointer"
                      >
                        📝
                      </button>
                      <button 
                        onClick={() => statusMutation.mutate({ id: s.id, activa: !s.activa })}
                        className="hover:scale-125 transition-transform cursor-pointer"
                      >
                        🔄
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-400 italic">
                  No hay datos disponibles en este momento.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Componente Modal de creación/edición */}
      <SucursalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        sucursalAEditar={selectedSucursal} 
      />
    </div>
  );
};

export default Branches;