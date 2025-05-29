import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { recipientsApi } from '@/api/recipients/recipients';
import { CreateRecipientDto, RecipientAPI } from '@/api/recipients/types';

/** RQ wrapper for POST /recipients */
export const useCreateRecipient = (
  options?: UseMutationOptions<RecipientAPI, Error, CreateRecipientDto, unknown>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecipientDto) => recipientsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipients'] });
    },
    onError: (error) => {
      toast.error('Failed to create recipient', {
        description: error.message,
      });
    },
    ...options,
  });
};
