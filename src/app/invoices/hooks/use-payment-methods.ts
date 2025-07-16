import { useEndorsements } from '@/app/(with-sidebar)/recipients/hooks/use-endorsements';
import { AcceptedPaymentMethod } from '@/app/invoices/schema';

export const usePaymentMethods = () => {
  const { isEurApproved, hasEurAccount, isBaseApproved, hasUsdAccount } =
    useEndorsements();

  return buildPaymentMethods(
    isBaseApproved && hasUsdAccount,
    isEurApproved && hasEurAccount
  );
};

const buildPaymentMethods = (usd: boolean, eur: boolean) => {
  const methods: AcceptedPaymentMethod[] = ['usdc'];
  if (usd) methods.push('usd');
  if (eur) methods.push('eur');
  return methods;
};
