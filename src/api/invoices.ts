import axios from 'axios';

import { sampleInvoices } from '@/app/invoices/components/dashboard/sample-invoices';
import { Invoice } from '@/app/invoices/components/dashboard/utils';

import { InvoiceFormData } from '../app/invoices/components/create/invoice-form-context';
import { env } from '../lib/env';

// TODO: Implement these once the backend is sending data

export const createInvoice = async (
  invoice: InvoiceFormData
): Promise<Invoice> => {
  // const res = await axios.post(
  //   `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices`,
  //   invoice
  // );
  // return res;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '3f7af738-5d50-4d62-9fe9-1e2c1c8b9e9a',
        ...invoice,
        status: 'open',
        totalAmount: 0,
      });
    }, 2000);
  });
};

export const getInvoices = async (): Promise<Invoice[]> => {
  // const res = await axios.get(`${env.NEXT_PUBLIC_SORBET_API_URL}/invoices`);
  // return res;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleInvoices);
    }, 2000);
  });
};

export const getInvoice = async (id: string): Promise<Invoice> => {
  // const res = await axios.get(`${env.NEXT_PUBLIC_SORBET_API_URL}/invoices/${id}`);
  // return res;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleInvoices[0]);
    }, 2000);
  });
};
