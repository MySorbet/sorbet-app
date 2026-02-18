import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { claimVirtualAccount } from '@/api/bridge/bridge';
import { getApiErrorMessage } from '@/api/error-message';

export const useClaimVirtualAccount = (
  type: 'usd' | 'eur',
  options?: UseMutationOptions
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => claimVirtualAccount(type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bridgeCustomer'] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
    ...options,
  });
};
