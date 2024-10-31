import axios from 'axios';

import { InvoiceFormData } from '@/app/invoices/components/create/invoice-form-context';
import { Invoice } from '@/app/invoices/components/dashboard/utils';
import { env } from '@/lib/env';

import { withAuthHeader } from '../withAuthHeader';

/** Creates a new invoice. */
export const createInvoice = async (invoice: InvoiceFormData) => {
  const res = await axios.post<Invoice>(
    `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices`,
    invoice,
    await withAuthHeader()
  );
  return res.data;
};

/**
 * Gets a single invoice by id.
 *
 * Note: we do not send the auth header because this is a public endpoint
 */
export const getInvoice = async (id: string) => {
  const res = await axios.get<Invoice>(
    `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices/${id}`
  );
  return res.data;
};
