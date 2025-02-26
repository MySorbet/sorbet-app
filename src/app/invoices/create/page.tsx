'use client';

import { useRouter } from 'next/navigation';

import { Authenticated } from '@/app/authenticated';
import { useIsVerified } from '@/hooks/profile/use-is-verified';
import { useAuth } from '@/hooks/use-auth';
import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';

import { CreateInvoice } from '../components/create-invoice';
import { useCreateInvoice } from '../hooks/use-create-invoice';
import { useInvoiceNumber } from '../hooks/use-invoice-number';
import { InvoiceForm } from '../schema';

export default function CreateInvoicePage() {
  const router = useRouter();
  const { user } = useAuth();
  const isVerified = useIsVerified();

  const invoiceNumber = useInvoiceNumber();

  const { smartWalletAddress } = useSmartWalletAddress();

  const onGetVerified = isVerified ? undefined : () => router.push('/verify');

  const handleClose = () => router.push('/invoices');

  const { mutateAsync: createInvoice, isPending } = useCreateInvoice();
  const handleCreate = async (invoice: InvoiceForm) => {
    const newInvoice = await createInvoice(invoice);
    router.push(`/invoices/${newInvoice.id}`);
  };

  return (
    <Authenticated>
      <main className='flex w-full flex-col items-center justify-center'>
        <CreateInvoice
          onClose={handleClose}
          onCreate={handleCreate}
          isCreating={isPending}
          onGetVerified={onGetVerified}
          walletAddress={smartWalletAddress ?? undefined}
          prefills={{
            fromName: user?.firstName,
            fromEmail: user?.email,
            invoiceNumber,
            paymentMethods: isVerified ? ['usdc', 'usd'] : undefined,
          }}
        />
      </main>
    </Authenticated>
  );
}
