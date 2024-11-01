import { useMutation } from '@tanstack/react-query';

import { cancelInvoice } from '@/api/invoices/invoices';

/**
 * RQ wrapper on cancel invoice API call.
 */
export const useCancelInvoice = () => {
  const { mutateAsync: cancelInvoiceMutation, isPending } = useMutation({
    mutationFn: cancelInvoice,
  });
  return { cancelInvoiceMutation, isPending };
};
