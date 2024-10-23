'use client';

import { useRouter } from 'next/navigation';

import { InvoiceDetails } from '@/app/invoices/components/create/invoice-details';

import { useInvoiceNumber } from '../../hooks/useInvoiceNumber';

export default function InvoiceDetailsPage() {
  const router = useRouter();
  const invoiceNumber = useInvoiceNumber();

  return <InvoiceDetails onBack={router.back} invoiceNumber={invoiceNumber} />;
}
