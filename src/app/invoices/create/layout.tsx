'use client';

import Authenticated from '@/app/authenticated';
import { Header } from '@/components/header';

import { InvoiceFormProvider } from '../components/create/invoice-form-context';

// TODO: each route should prefetch the next one

export default function CreateInvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Authenticated>
      <Header />
      <InvoiceFormProvider>{children}</InvoiceFormProvider>
    </Authenticated>
  );
}
