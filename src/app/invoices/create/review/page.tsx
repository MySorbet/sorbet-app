'use client';

import { useRouter } from 'next/navigation';

import { useInvoiceFormContext } from '../../components/create/invoice-form-context';
import { useCreateInvoice } from '../../hooks/useCreateInvoice';
import { InvoiceReview } from '../../components/create/invoice-review';

export default function ReviewPage() {
  const { formData } = useInvoiceFormContext();
  const router = useRouter();
  const { mutateAsync: createInvoice, isPending } = useCreateInvoice();

  return (
    <InvoiceReview
      invoice={formData}
      onBack={() => router.back()}
      onCreate={async () => {
        const invoice = await createInvoice(formData);
        router.push(`/invoices/${invoice.id}`);
      }}
      isLoading={isPending}
    />
  );
}
