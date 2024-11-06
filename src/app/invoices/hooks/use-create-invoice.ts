import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
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
      // TODO: Understand this error handling better
      if (error instanceof AxiosError) {
        let errors = error.response?.data.message;
        if (errors instanceof Array) {
          errors = errors.join('\n ');
        }
        errors = error.message.concat('\n', errors);
        console.log('errors: ', errors);
        toast.error(errors);
      } else if (error instanceof Error) {
        console.log('error: ', error);
        toast.error(error.message);
      }
    },
  });
};
