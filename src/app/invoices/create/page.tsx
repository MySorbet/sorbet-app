'use client';

import { useRouter } from 'next/navigation';

import { useEndorsements } from '@/app/(with-sidebar)/recipients/hooks/use-endorsements';
import { Authenticated } from '@/app/authenticated';
import { usePaymentMethods } from '@/app/invoices/hooks/use-payment-methods';
import Page from '@/components/common/page';
import { useAuth } from '@/hooks/use-auth';
import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';

import { CreateInvoice } from '../components/create-invoice';
import { useCreateInvoice } from '../hooks/use-create-invoice';
import { useInvoiceNumber } from '../hooks/use-invoice-number';
import { InvoiceForm } from '../schema';

export default function CreateInvoicePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { isEurApproved, hasEurAccount, isBaseApproved, hasUsdAccount } =
    useEndorsements();

  const invoiceNumber = useInvoiceNumber();

  const { smartWalletAddress } = useSmartWalletAddress();

  // TODO: Is there a better option for this action? QP?
  const onGetVerified = (_: 'usd' | 'eur') => router.push('/verify');

  const handleClose = () => router.push('/invoices');

  const { mutateAsync: createInvoice, isPending } = useCreateInvoice();
  const handleCreate = async (invoice: InvoiceForm) => {
    const newInvoice = await createInvoice(invoice);
    router.push(`/invoices/${newInvoice.id}`);
  };

  const paymentMethods = usePaymentMethods();

  return (
    <Authenticated>
      <Page.Main>
        <CreateInvoice
          onClose={handleClose}
          onCreate={handleCreate}
          isCreating={isPending}
          isBaseEndorsed={isBaseApproved && hasUsdAccount}
          isEurEndorsed={isEurApproved && hasEurAccount}
          onGetVerified={onGetVerified}
          walletAddress={smartWalletAddress ?? undefined}
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
