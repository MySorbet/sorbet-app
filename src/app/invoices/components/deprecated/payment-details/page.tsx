'use client';

import { useRouter } from 'next/navigation';

import { PaymentDetails } from '@/app/invoices/components/deprecated/create/payment-details';

export default function PaymentDetailsPage() {
  const router = useRouter();
  return <PaymentDetails onBack={() => router.back()} />;
}
