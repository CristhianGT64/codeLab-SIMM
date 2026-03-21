import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '../../services/ClientsService';
import type { Client, CreateClientPayload } from '../../interfaces/Clients/ClientInterface';

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation<Client, Error, CreateClientPayload>({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error: unknown) => {
      console.error('Error creando cliente:', error);
    },
  });
};
