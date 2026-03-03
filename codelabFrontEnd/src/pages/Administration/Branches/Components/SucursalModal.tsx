import React, { useEffect, useState } from 'react';
import useSucursales from '../../../../hooks/useSucursales';

interface SucursalModalProps {
  isOpen: boolean;
  onClose: () => void;
  sucursalAEditar?: any;
}

const SucursalModal: React.FC<SucursalModalProps> = ({ isOpen, onClose, sucursalAEditar }) => {
  const { createMutation, updateMutation } = useSucursales();
  
  // Estado inicial del formulario
  const initialFormState = {
    nombre: '',
    direccion: '',
    gerente: '',
    telefono: '',
    activa: true
  };

  const [formData, setFormData] = useState(initialFormState);

  // Efecto para cargar datos si estamos editando
  useEffect(() => {
    if (sucursalAEditar) {
      setFormData(sucursalAEditar);
    } else {
      setFormData(initialFormState);
    }
  }, [sucursalAEditar, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'activa' ? value === 'true' : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que los campos no estén vacíos
    if (!formData.nombre || !formData.direccion || !formData.gerente) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      if (sucursalAEditar) {
        // Si hay un ID, editamos
        await updateMutation.mutateAsync({ id: sucursalAEditar.id, ...formData });
      } else {
        // Si no hay ID, creamos nueva
        await createMutation.mutateAsync(formData);
      }
      onClose(); // Cerrar modal al terminar
    } catch (error) {
      console.error("Error al guardar la sucursal:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-[#0799b6] p-6 text-white text-center">
          <h2 className="text-2xl font-bold">
            {sucursalAEditar ? 'Editar Sucursal' : 'Nueva Sucursal'}
          </h2>
          <p className="opacity-80 text-sm">Ingresa la información detallada</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#114c5f] mb-1">Nombre de la Sucursal</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej. Sucursal Central"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0799b6] outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#114c5f] mb-1">Dirección Completa</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0799b6] outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#114c5f] mb-1">Gerente</label>
              <input
                type="text"
                name="gerente"
                value={formData.gerente}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0799b6] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#114c5f] mb-1">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0799b6] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#114c5f] mb-1">Estado Operativo</label>
            <select
              name="activa"
              value={formData.activa.toString()}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#0799b6] outline-none"
            >
              <option value="true">Activa</option>
              <option value="false">Inactiva</option>
            </select>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border-2 border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1 py-3 px-4 bg-[#0799b6] text-white font-bold rounded-xl shadow-lg hover:bg-[#114c5f] transition-all disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending ? 'Guardando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SucursalModal;