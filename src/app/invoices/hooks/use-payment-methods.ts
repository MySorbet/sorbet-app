import { AcceptedPaymentMethod } from '@/app/invoices/schema';
import { useDueVerified } from '@/hooks/profile/use-due-verified';
import { useDueVirtualAccounts } from '@/hooks/profile/use-due-virtual-accounts';

export const usePaymentMethods = () => {
  const { isVerified } = useDueVerified();
  const { data: virtualAccounts } = useDueVirtualAccounts();

  const hasUsdAccount =
    virtualAccounts?.some((va) => va.schema === 'bank_us') ?? false;
  const hasEurAccount =
    virtualAccounts?.some((va) => va.schema === 'bank_sepa') ?? false;
  const hasAedAccount =
    virtualAccounts?.some((va) => va.schema === 'bank_mena') ?? false;

  return buildPaymentMethods(
    isVerified && hasUsdAccount,
    isVerified && hasEurAccount,
    isVerified && hasAedAccount
  );
};

const buildPaymentMethods = (usd: boolean, eur: boolean, aed: boolean) => {
  const methods: AcceptedPaymentMethod[] = ['usdc'];
  if (usd) methods.push('usd');
  if (eur) methods.push('eur');
  if (aed) methods.push('aed');
  return methods;
};
