import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { acceptDueTos } from '@/api/due/due';
import type { DueCustomer } from '@/types/due';

interface UseAcceptDueTosOptions {
  onSuccess?: (data: DueCustomer) => void;
  onError?: (error: Error) => void;
}

export const useAcceptDueTos = (options?: UseAcceptDueTosOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptDueTos,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dueCustomer'] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to accept TOS';
      toast.error(errorMessage);
      options?.onError?.(error instanceof Error ? error : new Error(errorMessage));
    },
  });
};
