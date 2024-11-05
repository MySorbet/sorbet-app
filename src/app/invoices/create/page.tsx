import { permanentRedirect } from 'next/navigation';

/** `/invoices/create` always redirects to the first step of invoice creation: `/invoices/create/client-details` */
export default async function CreateInvoicePage() {
  permanentRedirect('/invoices/create/client-details');
}
