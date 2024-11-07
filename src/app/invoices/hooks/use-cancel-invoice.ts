import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { cancelInvoice } from '@/api/invoices/invoices';

/**
 * RQ wrapper on cancel invoice API call.
 */
export const useCancelInvoice = () => {
  const { mutateAsync: cancelInvoiceMutation, isPending } = useMutation({
    mutationFn: cancelInvoice,
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { cancelInvoiceMutation, isPending };
};
