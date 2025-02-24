'use client';

import { useRouter } from 'next/navigation';

import { Authenticated } from '@/app/authenticated';

import { CreateInvoice } from '../components/create-invoice';
import { useCreateInvoice } from '../hooks/use-create-invoice';
import { InvoiceForm } from '../schema';

export default function CreateInvoicePage() {
  const router = useRouter();
  const handleClose = () => router.push('/invoices');
  const { mutateAsync: createInvoice, isPending } = useCreateInvoice();
  const handleCreate = async (invoice: InvoiceForm) => {
    const newInvoice = await createInvoice(invoice);
    router.push(`/invoices/${newInvoice.id}`);
  };

  return (
    <Authenticated>
      <main className='flex w-full flex-col items-center justify-center'>
        <CreateInvoice onClose={handleClose} onCreate={handleCreate} />
      </main>
    </Authenticated>
  );
}
