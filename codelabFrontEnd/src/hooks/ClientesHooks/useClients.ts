import { useQuery } from 'react-query';
import { listClients } from '../../services/ClientsService';

export const useClients = () => {
  return useQuery(['clients'], listClients);
};
