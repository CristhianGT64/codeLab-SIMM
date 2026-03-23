import { useQuery } from '@tanstack/react-query';
import { listClients } from '../../services/ClientsService';
import type { Client } from '../../interfaces/Clients/ClientInterface';

export const useClients = () => {
  return useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: listClients,
  });
};
