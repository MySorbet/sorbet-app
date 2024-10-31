import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createInvoice } from '@/api/invoices';
import { InvoiceFormData } from '@/app/invoices/components/create/invoice-form-context';

export const useCreateInvoice = () => {
  return useMutation({
    mutationKey: ['createInvoice'],
    mutationFn: (invoice: InvoiceFormData) => {
      return createInvoice(invoice);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
};
