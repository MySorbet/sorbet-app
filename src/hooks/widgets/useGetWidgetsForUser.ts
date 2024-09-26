import { useQuery } from '@tanstack/react-query';

import { getWidgetsForUser } from '@/api/widgets';

export const useGetWidgetsForUser = (userId: string) => {
  return useQuery({
    queryKey: ['widgets', userId],
    queryFn: async () => await getWidgetsForUser(userId),
  });
};
