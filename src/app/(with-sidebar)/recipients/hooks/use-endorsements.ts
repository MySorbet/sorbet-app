import { useBridgeCustomer } from '@/hooks/profile/use-bridge-customer';

export const useEndorsements = () => {
  const { data: customer } = useBridgeCustomer();

  const eurStatus = customer?.customer?.endorsements.find(
    (e) => e.name === 'sepa'
  )?.status;
  const baseStatus = customer?.customer?.endorsements.find(
    (e) => e.name === 'base'
  )?.status;

  const isBaseApproved = baseStatus === 'approved';
  const isEurApproved = eurStatus === 'approved';

  return {
    isBaseApproved,
    isEurApproved,
  };
};
