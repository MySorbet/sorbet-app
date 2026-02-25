import { type UseQueryOptions,useQuery } from '@tanstack/react-query';

import { type DueFeeStructure,getDueFeeStructures } from '@/api/due/due';

export const useDueFeeStructures = <
  T extends Omit<UseQueryOptions<DueFeeStructure[]>, 'queryKey' | 'queryFn'>
>(
  options?: T
) => {
  return useQuery<DueFeeStructure[]>({
    queryKey: ['dueFeeStructures'],
    queryFn: getDueFeeStructures,
    ...options,
  });
};
