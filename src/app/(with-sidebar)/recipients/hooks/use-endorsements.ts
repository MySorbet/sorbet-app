import { useBridgeCustomer } from '@/hooks/profile/use-bridge-customer';

export const useEndorsements = () => {
  const { data: customer, isPending } = useBridgeCustomer();

  const eurStatus = customer?.customer?.endorsements.find(
    (e) => e.name === 'sepa'
  )?.status;
  const baseStatus = customer?.customer?.endorsements.find(
    (e) => e.name === 'base'
  )?.status;

  const isBaseApproved = baseStatus === 'approved';
  const hasUsdAccount = customer?.virtual_account !== null;

  const isEurApproved = eurStatus === 'approved';
  const hasEurAccount = customer?.virtual_account_eur !== null;

  return {
    isBaseApproved,
    isEurApproved,
    isPending,
    hasUsdAccount,
    hasEurAccount,
  };
};
