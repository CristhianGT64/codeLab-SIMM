import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateClient } from '../../services/ClientsService';
import type { Client, UpdateClientPayload } from '../../interfaces/Clients/ClientInterface';

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation<Client, Error, { id: string; payload: UpdateClientPayload }>({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateClientPayload }) => updateClient(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', variables.id] });
    },
  });
};
