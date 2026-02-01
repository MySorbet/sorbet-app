import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    claimDueVirtualAccount,
    type ClaimableCurrency,
} from '@/api/due/due';

/**
 * Hook to claim a Due virtual account on-demand.
 * Automatically invalidates the dueVirtualAccounts query on success.
 */
export const useClaimDueVirtualAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (currency: ClaimableCurrency) =>
            claimDueVirtualAccount(currency),
        onSuccess: () => {
            // Invalidate virtual accounts query to refetch the updated list
            queryClient.invalidateQueries({ queryKey: ['dueVirtualAccounts'] });
        },
    });
};
