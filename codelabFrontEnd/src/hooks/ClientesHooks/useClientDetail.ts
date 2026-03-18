import { useQuery } from '@tanstack/react-query';
import { getClientById } from '../../services/ClientsService';
import type { ClientDetail } from '../../interfaces/Clients/ClientInterface';

export const useClientDetail = (id: string | undefined) => {
  return useQuery<ClientDetail>({
    queryKey: ['client', id],
    queryFn: () => getClientById(id ?? ''),
    enabled: Boolean(id),
  });
};
