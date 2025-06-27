import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { claimEurAccount } from '@/api/user/user';

export const useClaimEur = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: claimEurAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bridgeCustomer'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    },
  });
};
