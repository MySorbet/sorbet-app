import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createInvoice } from '@/api/invoices';
import { getApiErrorMessage } from '@/api/error-message';

import { InvoiceForm } from '../schema';

export const useCreateInvoice = () => {
  return useMutation({
    mutationKey: ['createInvoice'],
    mutationFn: ({
      invoice,
      pdfBase64,
    }: {
      invoice: InvoiceForm;
      pdfBase64?: string;
    }) => {
      return createInvoice(invoice, pdfBase64);
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error));
    },
  });
};
