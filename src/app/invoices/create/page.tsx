'use client';

import { useRouter } from 'next/navigation';

import { Authenticated } from '@/app/authenticated';
import { usePaymentMethods } from '@/app/invoices/hooks/use-payment-methods';
import Page from '@/components/common/page';
import { useDueVerified } from '@/hooks/profile/use-due-verified';
import { useDueVirtualAccounts } from '@/hooks/profile/use-due-virtual-accounts';
import { useAuth } from '@/hooks/use-auth';
import { useWalletAddress } from '@/hooks/use-wallet-address';

import { CreateInvoice } from '../components/create-invoice';
import { useCreateInvoice } from '../hooks/use-create-invoice';
import { useInvoiceNumber } from '../hooks/use-invoice-number';
import { InvoiceForm } from '../schema';

export default function CreateInvoicePage() {
  const router = useRouter();
  const { user } = useAuth();

  const { isVerified, isPending: isVerifiedPending } = useDueVerified();
  const { data: virtualAccounts, isPending: isAccountsPending } =
    useDueVirtualAccounts();

  const isEndorsementLoading = isVerifiedPending || isAccountsPending;
  const hasUsdAccount =
    virtualAccounts?.some((va) => va.schema === 'bank_us') ?? false;
  const hasEurAccount =
    virtualAccounts?.some((va) => va.schema === 'bank_sepa') ?? false;
  const hasAedAccount =
    virtualAccounts?.some((va) => va.schema === 'bank_mena') ?? false;

  // Pass undefined while loading so the payment tab shows a skeleton instead of "Get verified"
  const isBaseEndorsed = isEndorsementLoading
    ? undefined
    : isVerified && hasUsdAccount;
  const isEurEndorsed = isEndorsementLoading
    ? undefined
    : isVerified && hasEurAccount;
  const isAedEndorsed = isEndorsementLoading
    ? undefined
    : isVerified && hasAedAccount;

  const invoiceNumber = useInvoiceNumber();

  const { baseAddress, stellarAddress } = useWalletAddress();

  const onGetVerified = (_: 'usd' | 'eur' | 'aed') => router.push('/verify');
  const onClaimAccount = (_: 'usd' | 'eur' | 'aed') => router.push('/accounts');

  const handleClose = () => router.push('/invoices');

  const { mutateAsync: createInvoice, isPending } = useCreateInvoice();
  const handleCreate = async (invoice: InvoiceForm, pdfBase64?: string) => {
    const newInvoice = await createInvoice({ invoice, pdfBase64 });
    router.push(`/invoices/${newInvoice.id}`);
  };

  const paymentMethods = usePaymentMethods();

  return (
    <Authenticated>
      <Page.Main className='h-full'>
        <CreateInvoice
          onClose={handleClose}
          onCreate={handleCreate}
          isCreating={isPending}
          isBaseEndorsed={isBaseEndorsed}
          isEurEndorsed={isEurEndorsed}
          isAedEndorsed={isAedEndorsed}
          isDueVerified={isEndorsementLoading ? undefined : isVerified}
          onGetVerified={onGetVerified}
          onClaimAccount={onClaimAccount}
          walletAddress={baseAddress ?? undefined}
          stellarWalletAddress={stellarAddress ?? undefined}
          prefills={{
            fromName: user?.firstName,
            fromEmail: user?.email,
            invoiceNumber,
            paymentMethods,
          }}
        />
      </Page.Main>
    </Authenticated>
  );
}
