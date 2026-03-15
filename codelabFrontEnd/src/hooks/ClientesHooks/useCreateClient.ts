import { useMutation, useQueryClient } from 'react-query';
import { createClient } from '../../services/ClientsService';

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation(createClient, {
    onSuccess: () => {
      queryClient.invalidateQueries(['clients']);
    },
  });
};
