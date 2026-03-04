import { useMutation, useQueryClient } from '@tanstack/react-query';

import { clientsApi } from '@/api/clients/clients';
import { CreateClientDto } from '@/api/clients/types';

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClientDto) => clientsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};
