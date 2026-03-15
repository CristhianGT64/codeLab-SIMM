import { useMutation, useQueryClient } from 'react-query';
import { updateClient } from '../../services/ClientsService';

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation(({ id, payload }: { id: number; payload: any }) => updateClient(id, payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(['clients']);
    },
  });
};
