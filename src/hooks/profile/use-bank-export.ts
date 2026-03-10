import { type UseQueryOptions, useQuery } from '@tanstack/react-query';

import { type BankExportData, getBankExport } from '@/api/bridge/bridge';

export const useBankExport = <
  T extends Omit<UseQueryOptions<BankExportData>, 'queryKey' | 'queryFn'>
>(
  options?: T
) => {
  return useQuery<BankExportData>({
    queryKey: ['bankExport'],
    queryFn: getBankExport,
    ...options,
  });
};
