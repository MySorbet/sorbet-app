import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { payInvoice } from '@/api/invoices/invoices';

/**
 * RQ wrapper on pay invoice API call.
 */
export const usePayInvoice = () => {
  const { mutateAsync: payInvoiceMutation, isPending } = useMutation({
    mutationFn: payInvoice,
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { payInvoiceMutation, isPending };
};
