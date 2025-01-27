import { useQuery } from '@tanstack/react-query';

import { getInvoice } from '@/api/invoices';

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => getInvoice(id),
  });
}
