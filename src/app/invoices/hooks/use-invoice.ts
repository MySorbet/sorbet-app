import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getInvoice } from '@/api/invoices';

import { Invoice } from '../schema';
export function useInvoice(
  id: string,
  options?: Partial<UseQueryOptions<Invoice>>
) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => getInvoice(id),
    ...options,
  });
}
