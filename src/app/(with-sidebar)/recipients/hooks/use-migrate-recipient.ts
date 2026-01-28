import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { recipientsApi } from '@/api/recipients/recipients';
import { MigrateRecipientDto, RecipientAPI } from '@/api/recipients/types';

interface MigrateRecipientVariables {
  recipientId: string;
  data: MigrateRecipientDto;
}

/** RQ wrapper for POST /recipients/:id/migrate */
export const useMigrateRecipient = (
  options?: UseMutationOptions<
    RecipientAPI,
    Error,
    MigrateRecipientVariables,
    unknown
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recipientId, data }: MigrateRecipientVariables) =>
      recipientsApi.migrate(recipientId, data),
    onSuccess: (data) => {
      // Invalidate recipients list and the specific recipient details
      queryClient.invalidateQueries({ queryKey: ['recipients'] });
      queryClient.invalidateQueries({ queryKey: ['recipients', data.id] });
      toast.success('Recipient updated successfully');
    },
    onError: (error: any) => {
      // Extract error message from axios error response
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'An unexpected error occurred';
      
      toast.error('Failed to update recipient', {
        description: errorMessage || 'Consider creating a new recipient if this continues to happen.',
      });
      console.error('Migration error:', error);
    },
    ...options,
  });
};
