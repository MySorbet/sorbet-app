import { isAxiosError } from 'axios';

import { useBridgeCustomer } from '@/hooks/profile/use-bridge-customer';

export const useIsVerified = () => {
  const { data: customer } = useBridgeCustomer({
    retry: (_, error) => !(isAxiosError(error) && error.status === 404),
  });

  // Consider verification false if there is no customer yet
  if (!customer) {
    return false;
  }

  // Same criteria as the backend
  return (
    customer.kyc_status === 'approved' &&
    customer.tos_status === 'approved' &&
    customer.virtual_account !== null
  );
};
