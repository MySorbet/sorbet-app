'use client';

import { useRouter } from 'next/navigation';

import { createInvoice } from '@/api/invoices';
import { Authenticated } from '@/app/authenticated';
import { InvoiceFormData } from '@/app/invoices/components/create/invoice-form-context';

import { CreateInvoice } from '../v2/create-invoice';
import { InvoiceForm } from '../v2/schema';

export default function CreateInvoicePage() {
  const router = useRouter();
  const handleClose = () => router.push('/invoices');
  const handleCreate = async (invoice: InvoiceForm) => {
    const newInvoice = await createInvoice(adapt(invoice));
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

function adapt(invoice: InvoiceForm): InvoiceFormData {
  return {
    ...invoice,
    projectName: '',
    // @ts-expect-error - temp
    paymentMethods: undefined,
  };
}
