import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { cancelInvoice } from '@/api/invoices/invoices';
import { getApiErrorMessage } from '@/api/error-message';

/**
 * RQ wrapper on cancel invoice API call.
 */
export const useCancelInvoice = () => {
  const { mutateAsync: cancelInvoiceMutation, isPending } = useMutation({
    mutationFn: cancelInvoice,
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
  return { cancelInvoiceMutation, isPending };
};
