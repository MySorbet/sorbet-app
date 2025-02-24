'use client';

import { useRouter } from 'next/navigation';

import { InvoiceDetails } from '@/app/invoices/components/deprecated/create/invoice-details';

import { useInvoiceNumber } from '../../../hooks/use-invoice-number';

export default function InvoiceDetailsPage() {
  const router = useRouter();
  const invoiceNumber = useInvoiceNumber();

  return <InvoiceDetails onBack={router.back} invoiceNumber={invoiceNumber} />;
}
