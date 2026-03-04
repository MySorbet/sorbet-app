import { useMutation, useQueryClient } from '@tanstack/react-query';

import { clientsApi } from '@/api/clients/clients';
import { UpdateClientDto } from '@/api/clients/types';

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientDto }) =>
      clientsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};
