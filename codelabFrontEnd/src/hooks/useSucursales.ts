import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as service from '../services/sucursalService';

const useSucursales = (id?: string) => {
  const queryClient = useQueryClient();

  // 1. GET - Todas las sucursales 
  const sucursalesQuery = useQuery({
    queryKey: ['sucursales'],
    queryFn: service.fetchSucursales,
  });

  // 2. GET - Una sucursal por ID 
  const sucursalByIdQuery = useQuery({
    queryKey: ['sucursal', id],
    queryFn: () => service.fetchSucursalById(id!),
    enabled: !!id,
  });

  // 3. POST - Crear una sucursal
  const createMutation = useMutation({
    mutationFn: service.createSucursal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sucursales'] }),
  });

  // 4. PUT - Editar una sucursal
   const updateMutation = useMutation({
  mutationFn: (data: any) => service.updateSucursal(data), 
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sucursales'] }),
  });

  // 5. PATCH - Activar/Desactivar
  const statusMutation = useMutation({
    mutationFn: ({ id, activa }: { id: string; activa: boolean }) => 
      service.patchSucursalStatus(id, activa),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sucursales'] }),
  });

  return {
    sucursalesQuery,
    sucursalByIdQuery,
    createMutation,
    updateMutation,
    statusMutation,
  };
};

export default useSucursales;