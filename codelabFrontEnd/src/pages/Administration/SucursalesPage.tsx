import React, { useState } from 'react';
import useSucursales from '../../hooks/useSucursales';
import { CardTotalComponent } from '../../components/cardTotalComponent/CardTotalComponent';

export const SucursalesPage = () => {
  // Se consume el Hook
  const { sucursalesQuery, createMutation, updateMutation, statusMutation } = useSucursales();
  
  // Estados para el modal y edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSucursal, setEditingSucursal] = useState<any>(null);

  // Colores de la paleta
  const colors = {          // Explicación del uso de los colores:
    eden: '#114c5f',      // Azul Oscuro (Títulos/Botones principales)
    bondi: '#0799b6',     // Azul Medio (Encabezados/Primario)
    sanMarino: '#4a6eb0', // Azul Suave (Hover)
    sinbad: '#9cd2d3',    // Azul Claro (Detalles/Bordes)
    janna: '#f2e6cf'      // Beige (Fondo)
  };

  const handleOpenModal = (sucursal = null) => {
    setEditingSucursal(sucursal);
    setIsModalOpen(true);
  };

  return (
    <div style={{ backgroundColor: colors.janna }} className="min-h-screen p-8 font-sans">
      {/* 1. Header y botón "Nueva" */}
      <div className="flex justify-between items-center mb-8">
        <h1 style={{ color: colors.eden }} className="text-3xl font-bold">HU-1.7 Gestión de Sucursales</h1>
        <button 
          onClick={() => handleOpenModal()}
          style={{ backgroundColor: colors.bondi }}
          className="text-white px-6 py-3 rounded-full font-bold shadow-lg hover:opacity-90 transition-all"
        >
          + Registrar Sucursal
        </button>
      </div>

      {/* 2. Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <CardTotalComponent title="Total" total={sucursalesQuery.data?.data.length || 0} color={colors.sanMarino} />
        <CardTotalComponent title="Activas" total={sucursalesQuery.data?.data.filter((s:any) => s.activa).length || 0} color={colors.bondi} />
        <CardTotalComponent title="Inactivas" total={sucursalesQuery.data?.data.filter((s:any) => !s.activa).length || 0} color={colors.eden} />
      </div>

      {/* 3. Tabla de listado */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#9cd2d3]">
        <table className="w-full">
          <thead style={{ backgroundColor: colors.bondi }} className="text-white">
            <tr>
              <th className="p-4 text-left">Sucursal</th>
              <th className="p-4 text-left">Gerente</th>
              <th className="p-4 text-center">Estado</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sucursalesQuery.data?.data.map((s: any) => (
              <tr key={s.id} className="border-b hover:bg-[#9cd2d3]/20 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-[#114c5f]">{s.nombre}</div>
                  <div className="text-xs text-gray-500">{s.direccion}</div>
                </td>
                <td className="p-4 text-gray-600">{s.gerente}</td>
                <td className="p-4 text-center">
                  <span className={`px-4 py-1 rounded-full text-xs font-bold ${s.activa ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {s.activa ? 'ACTIVA' : 'INACTIVA'}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-4">
                  <button onClick={() => handleOpenModal(s)} className="text-[#4a6eb0] text-xl">📝</button>
                  <button onClick={() => statusMutation.mutate({ id: s.id, activa: !s.activa })} className="text-[#114c5f] text-xl">🔄</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};