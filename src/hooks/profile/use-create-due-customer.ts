import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { verifyDueUser } from '@/api/due/due';
import type { DueCustomer } from '@/types/due';

interface UseCreateDueCustomerOptions {
  onSuccess?: (data: DueCustomer) => void;
  onError?: (error: Error) => void;
}

export const useCreateDueCustomer = (options?: UseCreateDueCustomerOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyDueUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dueCustomer'] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast.error(errorMessage);
      options?.onError?.(error instanceof Error ? error : new Error(errorMessage));
    },
  });
};
