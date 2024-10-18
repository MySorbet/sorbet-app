import { useQuery } from '@tanstack/react-query';

import { getInvoice } from '@/api/invoices';

export function useInvoice(id: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => getInvoice(id),
  });
  return { data, isLoading };
}
