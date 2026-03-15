import { useQuery } from 'react-query';
import { getClientById } from '../../services/ClientsService';

export const useClientDetail = (id: number) => {
  return useQuery(['client', id], () => getClientById(id), {
    enabled: !!id,
  });
};
