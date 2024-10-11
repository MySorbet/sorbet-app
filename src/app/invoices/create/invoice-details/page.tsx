'use client';

import { useRouter } from 'next/navigation';

import { InvoiceDetails } from '@/app/invoices/components/create/invoice-details';
import { useInvoiceFormContext } from '@/app/invoices/create/layout';

export default function InvoiceDetailsPage() {
  const router = useRouter();
  const { formData } = useInvoiceFormContext();
  return (
    <InvoiceDetails
      onBack={() => router.back()}
      invoiceNumber={formData.invoiceNumber}
    />
  );
}
