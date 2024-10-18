import axios from 'axios';

import { InvoiceFormData } from '../app/invoices/components/create/invoice-form-context';
import { env } from '../lib/env';

export const createInvoice = async (invoice: InvoiceFormData) => {
  // const res = await axios.post(
  //   `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices`,
  //   invoice
  // );
  // return res;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '123',
      });
    }, 2000);
  });
};
