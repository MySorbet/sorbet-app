import { useQuery } from '@tanstack/react-query';

import { getInvoices } from '@/api/invoices';

export const useInvoices = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices,
  });
  return { data, isLoading };
};
