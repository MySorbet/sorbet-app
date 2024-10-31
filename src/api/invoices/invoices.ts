import axios from 'axios';

import { InvoiceFormData } from '@/app/invoices/components/create/invoice-form-context';
import {
  calculateTotalAmount,
  Invoice,
} from '@/app/invoices/components/dashboard/utils';
import { env } from '@/lib/env';

export const createInvoice = async (invoice: InvoiceFormData) => {
  // TODO: total calculation should be done on the backend probably
  const totalAmount = calculateTotalAmount(invoice.items ?? []);
  const res = await axios.post<Invoice>(
    `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices`,
    {
      ...invoice,
      totalAmount,
    }
  );
  return res.data;
};

export const getInvoices = async () => {
  const res = await axios.get<Invoice[]>(
    `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices`
  );
  return res.data;
};

export const getInvoice = async (id: string) => {
  const res = await axios.get<Invoice>(
    `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices/${id}`
  );
  return res.data;
};
