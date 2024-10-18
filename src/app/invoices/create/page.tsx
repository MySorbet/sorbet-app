import { permanentRedirect } from 'next/navigation';

export default async function CreateInvoicePage() {
  permanentRedirect('/invoices/create/client-details');
}
