'use client';

import { useRouter } from 'next/navigation';

import { createInvoice } from '@/api/invoices';
import { Authenticated } from '@/app/authenticated';

import { CreateInvoice } from '../components/create-invoice';
import { InvoiceForm } from '../components/schema';

export default function CreateInvoicePage() {
  const router = useRouter();
  const handleClose = () => router.push('/invoices');
  const handleCreate = async (invoice: InvoiceForm) => {
    const newInvoice = await createInvoice(invoice);
    router.push(`/invoices/${newInvoice.id}`);
  };

  return (
    <Authenticated>
      <main className='flex size-full flex-col'>
        <div className='container flex flex-1 justify-center p-6'>
          <CreateInvoice onClose={handleClose} onCreate={handleCreate} />
        </div>
      </main>
    </Authenticated>
  );
}
