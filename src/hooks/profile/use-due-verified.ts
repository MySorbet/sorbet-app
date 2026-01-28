import { isAxiosError } from 'axios';

import { useDueCustomer } from '@/hooks/profile/use-due-customer';

/**
 * Hook to check if a user is verified with Due Network.
 * A user is considered verified if they have a Due customer account
 * with an active status (account exists and KYC approved).
 */
export const useDueVerified = () => {
  const { data: dueCustomer, isPending, error } = useDueCustomer({
    retry: (_, err) => !(isAxiosError(err) && err.response?.status === 404),
  });

  // User is verified if they have a Due account with active status
  const account = dueCustomer?.account;
  const isVerified = !!dueCustomer?.account_id && account?.status === 'active';

  return {
    isVerified,
    isPending,
    error,
    customer: dueCustomer,
    account,
  };
};
