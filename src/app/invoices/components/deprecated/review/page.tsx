'use client';

import { useRouter } from 'next/navigation';

import { useCreateInvoice } from '../../../hooks/use-create-invoice';
import { useInvoiceFormContext } from '../create/invoice-form-context';
import { InvoiceReview } from '../create/invoice-review';

export default function ReviewPage() {
  const { formData } = useInvoiceFormContext();
  const router = useRouter();
  const { mutateAsync: createInvoice, isPending } = useCreateInvoice();

  return (
    <InvoiceReview
      invoice={formData}
      onBack={() => router.back()}
      onCreate={async () => {
        // @ts-expect-error - this component is deprecated and just kept for reference
        const invoice = await createInvoice(formData);
        router.push(`/invoices/${invoice.id}`);
      }}
      isLoading={isPending}
    />
  );
}
