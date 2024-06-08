import { getWidgetsForUser } from '@/lib/service';
import { useQuery } from '@tanstack/react-query';

export const useGetWidgetsForUser = (userId: string) => {
  return useQuery({
    queryKey: ['widgets', userId],
    queryFn: async () => await getWidgetsForUser(userId),
  });
};
