import { useQuery } from '@tanstack/react-query';

import { checkInvoiceNumber } from '@/api/invoices/invoices';

/**
 * Gets the next available invoice number for the current user.
 * Currently, this is just based on the number of invoices the user has.
 */
export const useInvoiceNumber = () => {
  const { data } = useQuery({
    queryKey: ['invoice-number'],
    queryFn: () => checkInvoiceNumber(),
  });
  return data?.recommendation;
};
