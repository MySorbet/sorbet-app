import { isAxiosError } from 'axios';

import { useBridgeCustomer } from '@/hooks/profile/use-bridge-customer';

export const useIsVerified = () => {
  const { data: bridgeCustomer } = useBridgeCustomer({
    retry: (_, error) => !(isAxiosError(error) && error.status === 404),
  });

  const customer = bridgeCustomer?.customer;

  // Consider verification false if there is no customer yet
  if (!customer) {
    return false;
  }

  return (
    customer.status === 'active' && bridgeCustomer.virtual_account !== null
  );
};
