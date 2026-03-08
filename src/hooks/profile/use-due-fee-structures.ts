import { type UseQueryOptions, useQuery } from '@tanstack/react-query';

import { type DueFeeStructure, getDueFeeStructures } from '@/api/due/due';

export const useDueFeeStructures = <
  T extends Omit<UseQueryOptions<DueFeeStructure[]>, 'queryKey' | 'queryFn'>
>(
  direction?: 'on_ramp' | 'off_ramp',
  options?: T
) => {
  return useQuery<DueFeeStructure[]>({
    queryKey: ['dueFeeStructures', direction ?? 'on_ramp'],
    queryFn: () => getDueFeeStructures(direction),
    ...options,
  });
};
