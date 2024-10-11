'use client';

import { useRouter } from 'next/navigation';

import { InvoiceDetails } from '@/app/invoices/components/create/invoice-details';

export default function InvoiceDetailsPage() {
  const router = useRouter();
  return <InvoiceDetails onBack={() => router.back()} invoiceNumber='INV-01' />;
}
