'use client';

import { useRouter } from 'next/navigation';

import { useCreateInvoice } from '@/hooks/invoices/useCreateInvoice';

import { useInvoiceFormContext } from '../../components/create/invoice-form-context';
import { InvoicePDFRender } from '../../components/invoice-pdf-render';

export default function ReviewPage() {
  const { formData } = useInvoiceFormContext();
  const router = useRouter();
  const { mutateAsync: createInvoice, isPending } = useCreateInvoice();

  return (
    <InvoicePDFRender
      invoice={formData}
      onBack={() => router.back()}
      onCreate={async () => {
        await createInvoice(formData);
      }}
      isLoading={isPending}
    />
  );
}
