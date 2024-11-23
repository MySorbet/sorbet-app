import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { openInvoice } from '@/api/invoices/invoices';

/**
 * RQ wrapper on open invoice API call.
 */
export const useOpenInvoice = () => {
  const { mutateAsync: openInvoiceMutation, isPending } = useMutation({
    mutationFn: openInvoice,
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { openInvoiceMutation, isPending };
};
