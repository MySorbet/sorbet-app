import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { verifyDueUser } from '@/api/due/due';

export const useCreateDueCustomer = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyDueUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dueCustomer'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    },
    ...options,
  });
};
