import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { recipientsApi } from '@/api/recipients/recipients';
import { RecipientAPI } from '@/api/recipients/types';

/** RQ wrapper for DELETE /recipients/:id */
export const useDeleteRecipient = (
  options?: UseMutationOptions<RecipientAPI, Error, string, unknown>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipientId: string) => recipientsApi.delete(recipientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipients'] });
    },
    onError: (error) => {
      toast.error('Failed to delete recipient', {
        description: error.message,
      });
    },
    ...options,
  });
};
