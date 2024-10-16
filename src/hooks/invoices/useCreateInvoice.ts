import { useMutation } from '@tanstack/react-query';

import { createInvoice } from '@/api/invoices';
import { InvoiceFormData } from '@/app/invoices/components/create/invoice-form-context';

export const useCreateInvoice = () => {
  return useMutation({
    mutationKey: ['createInvoice'],
    mutationFn: (invoice: InvoiceFormData) => {
      return createInvoice(invoice);
    },
  });
};
